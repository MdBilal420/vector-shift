// executionEngine.js
// Handles pipeline execution and data flow between nodes

import { useStore } from './store';

export class ExecutionEngine {
  constructor() {
    this.store = null;
  }

  // Initialize with store instance
  init(store) {
    this.store = store;
  }

  // Build dependency graph from nodes and edges
  buildDependencyGraph(nodes, edges) {
    const graph = {};
    const inDegree = {};

    // Initialize graph
    nodes.forEach(node => {
      graph[node.id] = [];
      inDegree[node.id] = 0;
    });

    // Build adjacency list and calculate in-degrees
    edges.forEach(edge => {
      graph[edge.source].push({
        targetNode: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      });
      inDegree[edge.target]++;
    });

    return { graph, inDegree };
  }

  // Topological sort to determine execution order
  getExecutionOrder(nodes, edges) {
    const { graph, inDegree } = this.buildDependencyGraph(nodes, edges);
    const queue = [];
    const executionOrder = [];

    // Find nodes with no dependencies (input nodes)
    Object.keys(inDegree).forEach(nodeId => {
      if (inDegree[nodeId] === 0) {
        queue.push(nodeId);
      }
    });

    // Process nodes in topological order
    while (queue.length > 0) {
      const currentNode = queue.shift();
      executionOrder.push(currentNode);

      // Process all nodes that depend on current node
      graph[currentNode].forEach(connection => {
        inDegree[connection.targetNode]--;
        if (inDegree[connection.targetNode] === 0) {
          queue.push(connection.targetNode);
        }
      });
    }

    // Check for cycles
    if (executionOrder.length !== nodes.length) {
      throw new Error('Circular dependency detected in pipeline');
    }

    return executionOrder;
  }

  // Get input data for a node from its connected sources
  async getNodeInputData(nodeId) {
    const inputConnections = this.store.getNodeInputs(nodeId);
    const inputData = {};

    for (const connection of inputConnections) {
      const sourceResult = this.store.executionState.nodeResults[connection.source];
      
      if (!sourceResult) {
        throw new Error(`Input data not available from node ${connection.source}`);
      }

      // Map the output handle to input handle
      const handleKey = connection.targetHandle || 'input';
      const outputKey = connection.sourceHandle || 'output';
      
      inputData[handleKey] = sourceResult[outputKey] || sourceResult;
    }

    return inputData;
  }

  // Execute a single node
  async executeNode(nodeId) {
    const node = this.store.getNode(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    console.log(`Executing node: ${nodeId} (${node.type})`);
    
    // Set status to executing
    this.store.setNodeStatus(nodeId, 'executing');

    try {
      // Get input data from connected nodes
      const inputData = await this.getNodeInputData(nodeId);
      
      // Execute node based on its type
      const result = await this.executeNodeByType(node, inputData);
      
      // Store result
      this.store.setNodeResult(nodeId, result);
      this.store.setNodeStatus(nodeId, 'completed');
      
      console.log(`Node ${nodeId} completed with result:`, result);
      return result;
      
    } catch (error) {
      console.error(`Error executing node ${nodeId}:`, error);
      this.store.setNodeStatus(nodeId, 'error');
      throw error;
    }
  }

  // Execute node based on its type
  async executeNodeByType(node, inputData) {
    const { type, data } = node;

    switch (type) {
      case 'customInput':
        return this.executeInputNode(data, inputData);
      
      case 'text':
        return this.executeTextNode(data, inputData);
      
      case 'llm':
        return this.executeLLMNode(data, inputData);
      
      case 'transform':
        return this.executeTransformNode(data, inputData);
      
      case 'api':
        return this.executeApiNode(data, inputData);
      
      case 'database':
        return this.executeDatabaseNode(data, inputData);
      
      case 'filter':
        return this.executeFilterNode(data, inputData);
      
      case 'customOutput':
        return this.executeOutputNode(data, inputData);
      
      default:
        throw new Error(`Unknown node type: ${type}`);
    }
  }

  // Node execution implementations
  async executeInputNode(data, inputData) {
    // Input nodes generate data based on their configuration
    const value = data.inputName || 'default_input';
    return { 
      value: value,
      type: data.inputType || 'Text'
    };
  }

  async executeTextNode(data, inputData) {
    // Text nodes process text with variable interpolation
    let textContent = data.text || '';
    
    // If no text content, use input data directly
    if (!textContent && inputData.input) {
      textContent = inputData.input.value || inputData.input || '';
    }
    
    // Resolve variables in the text content
    const resolvedText = await this.resolveVariables(textContent, inputData);
    
    return {
      output: resolvedText
    };
  }

  // Resolve {{variableName}} patterns in text
  async resolveVariables(text, inputData) {
    if (!text || typeof text !== 'string') {
      return text;
    }

    // Find all {{variableName}} patterns
    const variablePattern = /{{([^}]+)}}/g;
    let resolvedText = text;
    
    // Get all available input nodes for reference
    const { nodes } = this.store;
    const inputNodes = nodes.filter(node => node.type === 'customInput');
    
    // Replace each variable with its corresponding value
    const matches = text.matchAll(variablePattern);
    for (const match of matches) {
      const variableName = match[1].trim();
      const fullMatch = match[0]; // e.g., "{{userName}}"
      
      // Find the input node with matching display name
      const inputNode = inputNodes.find(node => {
        const displayName = node.data.inputName || `input_${node.id.split('-')[1]}`;
        return displayName === variableName;
      });
      
      if (inputNode) {
        // Get the result from the input node
        const inputResult = this.store.executionState.nodeResults[inputNode.id];
        if (inputResult && inputResult.value !== undefined) {
          const replacementValue = inputResult.value;
          resolvedText = resolvedText.replace(fullMatch, replacementValue);
        } else {
          // If no result available, leave the variable as is or show placeholder
          console.warn(`Variable ${variableName} not resolved - no data available`);
          resolvedText = resolvedText.replace(fullMatch, `[${variableName}]`);
        }
      } else {
        // Variable name doesn't match any input node
        console.warn(`Variable ${variableName} not found in available inputs`);
        resolvedText = resolvedText.replace(fullMatch, `[UNKNOWN: ${variableName}]`);
      }
    }
    
    return resolvedText;
  }

  async executeLLMNode(data, inputData) {
    // LLM node would call external API
    const systemPrompt = inputData.system?.output || '';
    const userPrompt = inputData.prompt?.output || '';
    
    // Simulate API call (replace with actual LLM API)
    await this.simulateDelay(1000);
    
    const response = `LLM Response to: "${userPrompt}" (System: "${systemPrompt}")`;
    
    return {
      response: response
    };
  }

  async executeTransformNode(data, inputData) {
    // Transform node applies data transformations
    const input = inputData.input;
    
    // Example transformations (extend based on your needs)
    let result = input;
    
    if (typeof input === 'string') {
      result = input.toUpperCase(); // Simple transformation
    }
    
    return {
      output: result
    };
  }

  async executeApiNode(data, inputData) {
    // API node makes HTTP requests
    const url = data.url || 'https://jsonplaceholder.typicode.com/posts/1';
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      
      return {
        output: result,
        status: response.status
      };
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  async executeDatabaseNode(data, inputData) {
    // Database node would save/retrieve data
    const inputToSave = inputData.input;
    
    // Simulate database operation
    await this.simulateDelay(500);
    
    return {
      saved: true,
      data: inputToSave
    };
  }

  async executeFilterNode(data, inputData) {
    // Filter node applies conditional logic
    const input = inputData.input;
    const condition = data.condition || 'true';
    
    // Simple filter example
    const passed = input && input.toString().length > 0;
    
    return {
      output: passed ? input : null,
      filtered: !passed
    };
  }

  async executeOutputNode(data, inputData) {
    // Output node collects final results
    return {
      result: inputData.input || inputData,
      outputName: data.outputName || 'final_output'
    };
  }

  // Utility function to simulate async delays
  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Execute entire pipeline
  async executePipeline() {
    const { nodes, edges } = this.store;
    
    if (nodes.length === 0) {
      throw new Error('No nodes to execute');
    }

    console.log('Starting pipeline execution...');
    
    // Clear previous execution state
    this.store.clearExecutionState();
    this.store.setExecutionState({ isExecuting: true });

    try {
      // Get execution order
      const executionOrder = this.getExecutionOrder(nodes, edges);
      console.log('Execution order:', executionOrder);
      
      this.store.setExecutionState({ executionOrder });

      // Execute nodes in order
      for (const nodeId of executionOrder) {
        await this.executeNode(nodeId);
      }

      console.log('Pipeline execution completed successfully');
      
      // Return final results
      return this.store.executionState.nodeResults;
      
    } catch (error) {
      console.error('Pipeline execution failed:', error);
      throw error;
    } finally {
      this.store.setExecutionState({ isExecuting: false });
    }
  }
}

// Create singleton instance
export const executionEngine = new ExecutionEngine(); 