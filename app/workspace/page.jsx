'use client';

import React, { useState } from "react";
import { Canvas } from "./(components)/canvas";
import { ComponentLibrary } from "./(components)/component-library";
import { NodeEditingPanel } from "./(components)/node-editing-panel";
import { ConnectionEditingPanel } from "./(components)/connection-editing-panel";

export default function Workspace() {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);

  const handleDragStart = (e, nodeData) => {
    e.dataTransfer.setData("application/json", JSON.stringify(nodeData));
  };

  const handleCloseNodePanel = () => {
    setSelectedNode(null);
  };

  const handleCloseConnectionPanel = () => {
    setSelectedConnection(null);
  };

  const handleUpdateNode = (updatedNode) => {
    setNodes(
      nodes.map((node) => (node.id === updatedNode.id ? updatedNode : node)),
    );
    setSelectedNode(updatedNode);
  };

  return (
    <div className="flex h-full">
      <ComponentLibrary
        onDragStart={handleDragStart}
      />

      <div className="flex-1 relative">
        <Canvas
          nodes={nodes}
          setNodes={setNodes}
          connections={connections}
          setConnections={setConnections}
          setSelectedNode={setSelectedNode}
          setSelectedConnection={setSelectedConnection}
        />
      </div>
      {selectedNode && (
        <NodeEditingPanel
          node={selectedNode}
          onClose={handleCloseNodePanel}
          onUpdate={handleUpdateNode}
        />
      )}

      {selectedConnection && (
        <ConnectionEditingPanel
          connection={selectedConnection}
          onClose={handleCloseConnectionPanel}
        />
      )}
    </div>
  );
}
