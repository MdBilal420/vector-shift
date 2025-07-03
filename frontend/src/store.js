// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {}, // Track node counts for ID generation
    // New execution state
    executionState: {
      isExecuting: false,
      nodeResults: {}, // nodeId -> output data
      nodeStatus: {}, // nodeId -> 'pending' | 'executing' | 'completed' | 'error'
      executionOrder: []
    },
    
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
          return node;
        }),
      });
    },

    // New execution methods
    setExecutionState: (newState) => {
      set({
        executionState: { ...get().executionState, ...newState }
      });
    },

    setNodeResult: (nodeId, result) => {
      const currentState = get().executionState;
      set({
        executionState: {
          ...currentState,
          nodeResults: { ...currentState.nodeResults, [nodeId]: result }
        }
      });
    },

    setNodeStatus: (nodeId, status) => {
      const currentState = get().executionState;
      set({
        executionState: {
          ...currentState,
          nodeStatus: { ...currentState.nodeStatus, [nodeId]: status }
        }
      });
    },

    // Get input connections for a node
    getNodeInputs: (nodeId) => {
      const { edges } = get();
      return edges.filter(edge => edge.target === nodeId);
    },

    // Get output connections for a node
    getNodeOutputs: (nodeId) => {
      const { edges } = get();
      return edges.filter(edge => edge.source === nodeId);
    },

    // Get node by ID
    getNode: (nodeId) => {
      const { nodes } = get();
      return nodes.find(node => node.id === nodeId);
    },

    // Clear execution state
    clearExecutionState: () => {
      set({
        executionState: {
          isExecuting: false,
          nodeResults: {},
          nodeStatus: {},
          executionOrder: []
        }
      });
    }
  }));
