"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { XIcon } from "lucide-react";

export function NodeEditingPanel({ node, onClose, onUpdate }) {
  const handleInputChange = (field, value) => {
    onUpdate({ ...node, [field]: value });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log("File uploaded:", file.name);
    }
  };

  return (
    <div className="w-80 bg-[#1A8DBE1A] border-l border-border p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Edit Node</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="node-name">Name</Label>
          <Input
            value={node.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="node-type">Type</Label>
          <Input value={node.type} readOnly />
        </div>
        <div>
          <Label htmlFor="node-description">Description</Label>
          <Textarea
            className="custom-scrollbar"
            value={node.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="node-prompt">AI Prompt</Label>
          <Textarea
            className="custom-scrollbar"
            value={node.prompt || ""}
            onChange={(e) => handleInputChange("prompt", e.target.value)}
            placeholder="Enter AI prompt here..."
          />
        </div>
        <div>
          <Label htmlFor="knowledge-base">Add knowledge base</Label>
          <Input
            type="file"
            onChange={handleFileUpload}
            accept=".txt,.pdf,.doc,.docx"
          />
        </div>
        <Button className="w-full" onClick={onClose}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
