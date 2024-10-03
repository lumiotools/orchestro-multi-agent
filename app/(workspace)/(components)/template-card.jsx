'use client';

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TemplateCard({ template }) {
  return (
    <Card className="overflow-hidden">
      <img
        src={template.thumbnail}
        alt={template.title}
        className="w-full h-40 object-cover"
      />

      <CardHeader>
        <CardTitle>{template.title}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}
