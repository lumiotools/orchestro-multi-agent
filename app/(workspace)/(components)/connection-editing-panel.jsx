'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";

export function ConnectionEditingPanel({ connection, onClose }) {
  return (
    <div
      className="w-80 bg-card border-l border-border p-4 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Edit Connection
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="connection-label">
            Label
          </Label>
          <Input value={connection.label || ""} />
        </div>
        <div>
          <Label htmlFor="connection-type">
            Type
          </Label>
          <Input value={connection.type || ""} />
        </div>
        {/* Add more fields as needed for connection properties */}
        <Button className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
