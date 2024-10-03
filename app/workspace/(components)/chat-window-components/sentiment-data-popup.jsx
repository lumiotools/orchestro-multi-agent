"use client";

import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

export const SentimentDataPopup = ({ data, onClose, isLoading }) => {
  const formattedData = Object.keys(data).map((carrier) => ({
    carrier,
    ...Object.fromEntries(
      data[carrier].map((item) => [item.attribute, item.score])
    ),
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Customer Sentiment Comparison</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={formattedData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="attribute" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="UPS"
              dataKey="UPS"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Radar
              name="FedEx"
              dataKey="FedEx"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Radar
              name="DHL Express"
              dataKey="DHL Express"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.6}
            />
            <Radar
              name="USPS"
              dataKey="USPS"
              stroke="#ff7300"
              fill="#ff7300"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
