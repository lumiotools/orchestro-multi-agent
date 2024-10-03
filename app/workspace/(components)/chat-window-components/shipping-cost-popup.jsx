"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

export const ShippingCostPopup = ({ data, onClose, isLoading }) => {
  return (
    <div className="bg-black text-white rounded-lg shadow-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Shipping Cost Comparison</h2>
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
        <ResponsiveContainer width="100%" height={325}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Distance" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="fedex" fill="#8884d8" />
            <Bar dataKey="ups" fill="#82ca9d" />
            <Bar dataKey="dhl" fill="#ffc658" />
            <Bar dataKey="usps" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
