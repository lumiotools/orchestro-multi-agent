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

export function SentimentDataPopup({ data, onClose, isLoading }) {
  const attributes = [
    ...new Set(
      Object.values(data).flatMap((carrier) =>
        carrier.map((item) => item.attribute)
      )
    ),
  ];

  const formattedData = attributes.map((attribute) => {
    const dataPoint = { attribute };
    Object.keys(data).forEach((carrier) => {
      const carrierData = data[carrier].find(
        (item) => item.attribute === attribute
      );
      dataPoint[carrier] = carrierData ? carrierData.score : 0;
    });
    return dataPoint;
  });

  const colors = {
    UPS: "#8884d8",
    FedEx: "#82ca9d",
    "DHL Express": "#ffc658",
    USPS: "#ff7300",
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg p-4 w-full max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Customer Sentiment Comparison</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
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
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={325}>
          <RadarChart data={formattedData}>
            <PolarGrid stroke="#4a5568" />
            <PolarAngleAxis dataKey="attribute" tick={{ fill: "#e2e8f0" }} />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#e2e8f0" }}
            />
            {Object.keys(data).map((carrier) => (
              <Radar
                key={carrier}
                name={carrier}
                dataKey={carrier}
                stroke={colors[carrier]}
                fill={colors[carrier]}
                fillOpacity={0.6}
              />
            ))}
            <Legend wrapperStyle={{ color: "#e2e8f0" }} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
