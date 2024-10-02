'use client';

import React, { useState, useRef, useEffect } from "react";
import { Node } from "./node";

export function Canvas({ setSelectedNode, setSelectedConnection }) {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [tempConnection, setTempConnection] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - dragOffset.x;
        const y = e.clientY - rect.top - dragOffset.y;
        canvas.style.backgroundPosition = `${x}px ${y}px`;
      }
      if (isDrawingConnection) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        setTempConnection((prev) => ({
          ...prev,
          endX: e.clientX - rect.left,
          endY: e.clientY - rect.top,
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (isDrawingConnection) {
        setIsDrawingConnection(false);
        setTempConnection(null);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isDrawingConnection]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const nodeData = JSON.parse(e.dataTransfer.getData("application/json"));
    const newNode = {
      id: Date.now().toString(),
      type: nodeData.type,
      name: nodeData.name,
      description: nodeData.description,
      x: e.clientX - rect.left - 75,
      y: e.clientY - rect.top - 25,
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const handleNodeConnectionStart = (nodeId, x, y) => {
    setIsDrawingConnection(true);
    setTempConnection({
      sourceNodeId: nodeId,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });
  };

  const handleNodeConnectionEnd = (targetNodeId) => {
    if (isDrawingConnection && tempConnection.sourceNodeId !== targetNodeId) {
      const newConnection = {
        id: Date.now().toString(),
        sourceNodeId: tempConnection.sourceNodeId,
        targetNodeId: targetNodeId,
      };
      setConnections((prevConnections) => [...prevConnections, newConnection]);
    }
    setIsDrawingConnection(false);
    setTempConnection(null);
  };

  const handleNodeMove = (nodeId, newX, newY) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, x: newX, y: newY } : node,
      ),
    );
    setConnections((prevConnections) =>
      prevConnections.map((connection) => {
        if (
          connection.sourceNodeId === nodeId ||
          connection.targetNodeId === nodeId
        ) {
          return { ...connection };
        }
        return connection;
      }),
    );
  };

  const renderConnections = () => {
    return connections.map((connection) => {
      const sourceNode = nodes.find(
        (node) => node.id === connection.sourceNodeId,
      );
      const targetNode = nodes.find(
        (node) => node.id === connection.targetNodeId,
      );
      if (!sourceNode || !targetNode) return null;

      const startX = sourceNode.x + 96; // 96 = nodeWidth / 2
      const startY = sourceNode.y + 25; // 25 = nodeHeight / 2
      const endX = targetNode.x + 96;
      const endY = targetNode.y + 25;

      // Calculate control points for the bezier curve
      const controlX1 = startX + (endX - startX) / 2;
      const controlY1 = startY;
      const controlX2 = startX + (endX - startX) / 2;
      const controlY2 = endY;

      return (
        <g key={connection.id}>
          <path
            d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            onClick={() => setSelectedConnection(connection)}
            id={`connection-${connection.id}`}
          />

          <circle
            cx={startX}
            cy={startY}
            r="4"
            fill="hsl(var(--foreground))"
          />
          <circle
            cx={endX}
            cy={endY}
            r="4"
            fill="hsl(var(--foreground))"
          />
        </g>
      );
    });
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-grid-pattern relative"
      onMouseDown={handleMouseDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        {renderConnections()}
        {tempConnection && (
          <path
            d={`M${tempConnection.startX},${tempConnection.startY} C${
              tempConnection.startX +
              (tempConnection.endX - tempConnection.startX) / 2
            },${tempConnection.startY} ${
              tempConnection.startX +
              (tempConnection.endX - tempConnection.startX) / 2
            },${
              tempConnection.endY
            } ${tempConnection.endX},${tempConnection.endY}`}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          setSelectedNode={setSelectedNode}
          onConnectionStart={handleNodeConnectionStart}
          onConnectionEnd={handleNodeConnectionEnd}
          onNodeMove={handleNodeMove}
          id={`node-${node.id}`}
        />
      ))}
    </div>
  );
}
