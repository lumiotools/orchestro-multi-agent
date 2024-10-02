'use client';

import React from "react";
import { TemplateCard } from "./(components)/template-card";

export default function TemplateGallery() {
  const templates = [
    {
      id: 1,
      title: "Data Analysis Workflow",
      description:
        "User input ➔ Data Fetching Agent ➔ Analysis Agent ➔ Visualization Agent",
      thumbnail: "https://picsum.photos/seed/template1/300/200",
    },
    {
      id: 2,
      title: "Content Creation Pipeline",
      description: "Idea Generator ➔ Content Writer ➔ Editor Agent ➔ Publisher",
      thumbnail: "https://picsum.photos/seed/template2/300/200",
    },
    {
      id: 3,
      title: "Customer Service Bot",
      description:
        "User Query ➔ Intent Recognition ➔ Response Generator ➔ Feedback Loop",
      thumbnail: "https://picsum.photos/seed/template3/300/200",
    },
  ];

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
