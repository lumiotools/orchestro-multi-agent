"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, SunIcon, SettingsIcon, HelpCircleIcon } from "lucide-react";

export function Sidebar({ setCurrentPage }) {
  return (
    <aside className="w-16 bg-[#1A8DBE1A] border-r border-border flex flex-col items-center py-4 space-y-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCurrentPage("workspace")}
      >
        <HomeIcon className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCurrentPage("templates")}
      >
        <SunIcon className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon">
        <SettingsIcon className="h-6 w-6" />
      </Button>
      <div className="flex-grow" />
      <Button variant="ghost" size="icon">
        <HelpCircleIcon className="h-6 w-6" />
      </Button>
    </aside>
  );
}
