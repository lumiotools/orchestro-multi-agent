"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import { CustomNode } from "./custom-node";

const nodeTypes = {
  custom: CustomNode,
};

// const minimapStyle = {
//   height: 120,
// };

export function Canvas({ setSelectedNode, setSelectedConnection }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      setSelectedConnection(edge);
    },
    [setSelectedConnection]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (reactFlowInstance) {
        const nodeData = JSON.parse(
          event.dataTransfer.getData("application/json")
        );
        const position = reactFlowInstance.project({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: Date.now().toString(),
          type: "custom",
          position,
          data: { ...nodeData },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
      >
        <Controls />
        {/* <MiniMap style={minimapStyle} zoomable pannable /> */}
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
