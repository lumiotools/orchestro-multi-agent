"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = [
  "bg-purple-100 dark:bg-purple-900",
  "bg-blue-100 dark:bg-blue-900",
  "bg-green-100 dark:bg-green-900",
  "bg-yellow-100 dark:bg-yellow-900",
  "bg-red-100 dark:bg-red-900",
  "bg-indigo-100 dark:bg-indigo-900",
  "bg-pink-100 dark:bg-pink-900",
  "bg-teal-100 dark:bg-teal-900",
];

export function Node({
  node,
  setSelectedNode,
  onConnectionStart,
  onConnectionEnd,
  onNodeMove,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const randomColor = useMemo(
    () => colors[Math.floor(Math.random() * colors.length)],
    []
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const canvas = nodeRef.current.closest(".bg-grid-pattern");
        const rect = canvas.getBoundingClientRect();
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;
        node.x = newX;
        node.y = newY;
        nodeRef.current.style.left = `${newX}px`;
        nodeRef.current.style.top = `${newY}px`;
        onNodeMove(node.id, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, node, onNodeMove]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    const rect = nodeRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleConnectionStart = (e, position) => {
    e.stopPropagation();
    const rect = nodeRef.current.getBoundingClientRect();
    let x, y;
    if (position === "left") {
      x = rect.left;
      y = rect.top + rect.height / 2;
    } else {
      x = rect.right;
      y = rect.top + rect.height / 2;
    }
    onConnectionStart(node.id, x, y);
  };

  const handleConnectionEnd = (e) => {
    e.stopPropagation();
    onConnectionEnd(node.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setSelectedNode(node);
  };

  return (
    <Card
      ref={nodeRef}
      className={`w-48 absolute cursor-move ${randomColor}`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      id={`node-${node.id}`}
    >
      <CardHeader className="p-3" id={`node-header-${node.id}`}>
        <CardTitle className="text-sm" id={`node-title-${node.id}`}>
          {node.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0" id={`node-content-${node.id}`}>
        <p
          className="text-xs text-muted-foreground"
          id={`node-type-${node.id}`}
        >
          {node.type}
        </p>
        <div
          className="w-4 h-4 bg-gray-300 rounded-full absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer connection-dot"
          onMouseDown={(e) => handleConnectionStart(e, "left")}
          onMouseUp={handleConnectionEnd}
          id={`node-left-dot-${node.id}`}
        ></div>
        <div
          className="w-4 h-4 bg-gray-300 rounded-full absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 cursor-pointer connection-dot"
          onMouseDown={(e) => handleConnectionStart(e, "right")}
          onMouseUp={handleConnectionEnd}
          id={`node-right-dot-${node.id}`}
        ></div>
      </CardContent>
    </Card>
  );
}
