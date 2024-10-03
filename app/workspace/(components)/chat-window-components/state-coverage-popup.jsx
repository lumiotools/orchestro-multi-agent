"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export const CoverageDataPopup = ({ data, onClose, isLoading }) => {
  const carriers = Object.keys(data);
  const states = Object.keys(data[carriers[0]]);

  return (
    <div className="bg-black text-white rounded-lg shadow-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">State Coverage Comparison</h2>
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
        <ScrollArea className="max-h-[400px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                {carriers.map((carrier) => (
                  <th
                    key={carrier}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {carrier}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-black text-white divide-y divide-gray-200">
              {states.map((state) => (
                <tr key={state}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {state}
                  </td>
                  {carriers.map((carrier) => (
                    <td
                      key={`${state}-${carrier}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-white"
                    >
                      {(data[carrier][state] * 100).toFixed(1)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      )}
    </div>
  );
};
