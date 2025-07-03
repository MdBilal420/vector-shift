// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { DatabaseNode } from './nodes/databaseNode';
import { ApiNode } from './nodes/apiNode';
import { TransformNode } from './nodes/transformNode';
import { FilterNode } from './nodes/filterNode';
import { AnalyticsNode } from './nodes/analyticsNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  database: DatabaseNode,
  api: ApiNode,
  transform: TransformNode,
  filter: FilterNode,
  analytics: AnalyticsNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    console.log("nodes", nodes,edges);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          const dataTransfer = event.dataTransfer.getData('application/reactflow');
          
          if (dataTransfer) {
            const appData = JSON.parse(dataTransfer);
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              console.warn('Invalid node type dropped:', type);
              return;
            }

            // Ensure we have a valid reactFlowInstance
            if (!reactFlowInstance) {
              console.warn('React Flow instance not ready');
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };

            console.log('Adding new node:', newNode);
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDragEnter = useCallback((event) => {
        event.preventDefault();
    }, []);

    const onDragLeave = useCallback((event) => {
        event.preventDefault();
    }, []);

    const canvasStyle = {
      width: '100%',
      height: '70vh',
      borderRadius: '12px',
      background: 'white',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    };

    return (
        <>
        <div ref={reactFlowWrapper} style={canvasStyle}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                style={{ background: 'transparent' }}
                fitView
            > 
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap 
                  style={{
                    background: 'white',
                    border: '1px solid #e5e7eb'
                  }}
                  nodeColor="#a5b4fc"
                  maskColor="rgba(0, 0, 0, 0.1)"
                />
            </ReactFlow>
        </div>
        </>
    )
}
