"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon } from "lucide-react";

export function ComponentLibrary({ onDragStart }) {
  const [categories, setCategories] = useState([
    {
      name: "AI Agents",
      items: [
        {
          name: "Chat Agent",
          description:
            "An AI-powered chat agent that can engage in conversations, answer questions, and provide assistance based on its training.",
        },
        {
          name: "Carrier Comparison Agent",
          description:
            "An agent that compares different carriers based on various factors such as price, delivery time, and service quality to help users make informed decisions.",
        },
      ],
    },
  ]);

  const [newComponentName, setNewComponentName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddComponent = () => {
    if (newComponentName && selectedCategory) {
      setCategories(
        categories.map((category) =>
          category.name === selectedCategory
            ? {
                ...category,
                items: [
                  ...category.items,
                  { name: newComponentName, description: "" },
                ],
              }
            : category
        )
      );
      setNewComponentName("");
      setSelectedCategory("");
    }
  };

  return (
    <div className="w-64 bg-[#1A8DBE1A] border-r border-border flex flex-col">
      <div className="p-4">
        <Input placeholder="Search components..." />
      </div>
      <ScrollArea className="flex-1">
        <Accordion type="single" collapsible className="w-full">
          {categories.map((category, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="px-4">
                {category.name}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="py-2">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="px-4 py-2 hover:bg-accent cursor-move"
                      draggable
                      onDragStart={(e) =>
                        onDragStart(e, {
                          type: category.name.toLowerCase(),
                          name: item.name,
                          description: item.description,
                        })
                      }
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <Input
          placeholder="New component name"
          value={newComponentName}
          onChange={(e) => setNewComponentName(e.target.value)}
          className="mb-2"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full mb-2 p-2 border rounded bg-[#1E3A5F]"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <Button
          onClick={handleAddComponent}
          className="w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Component
        </Button>
      </div>
    </div>
  );
}
