"use client";

import React, { memo, useMemo } from "react";
import { Handle, Position } from "reactflow";

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

export const CustomNode = memo(({ data }) => {
  const randomColor = useMemo(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  return (
    <div className={`px-4 py-2 shadow-md rounded-[10px] ${randomColor}`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2" />
      <div className="font-bold">{data.name}</div>
      <div className="text-gray-500">{data.type}</div>
      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
