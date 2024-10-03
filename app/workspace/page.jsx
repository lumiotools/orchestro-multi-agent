"use client";

import React, { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { Canvas } from "./(components)/canvas";
import { ComponentLibrary } from "./(components)/component-library";
import { NodeEditingPanel } from "./(components)/node-editing-panel";
import { ConnectionEditingPanel } from "./(components)/connection-editing-panel";

export default function Workspace() {
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
    // This function will need to be implemented to update the node in the React Flow instance
    console.log("Update node:", updatedNode);
    setSelectedNode(updatedNode);
  };

  return (
    <div className="flex h-full">
      <ComponentLibrary onDragStart={handleDragStart} />
      <ReactFlowProvider>
        <div className="flex-1 relative">
          <Canvas
            setSelectedNode={setSelectedNode}
            setSelectedConnection={setSelectedConnection}
          />
        </div>
      </ReactFlowProvider>
      {selectedNode && (
        <NodeEditingPanel
          node={selectedNode.data}
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
