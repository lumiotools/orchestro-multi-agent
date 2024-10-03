"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";

export const CarrierRankingsPopup = ({ rankings, onClose, isLoading }) => {
  const getRankLabel = (index) => {
    switch (index) {
      case 0:
        return "1st";
      case 1:
        return "2nd";
      case 2:
        return "3rd";
      default:
        return `${index + 1}th`;
    }
  };

  const getCarrierName = (ranking) => {
    const key = Object.keys(ranking).find((key) =>
      key.includes("ranked_carrier")
    );
    return key ? ranking[key] : "Unknown Carrier";
  };

  return (
    <Card className="w-full bg-black rounded-[10px] border-none">
      <CardHeader className="py-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Carrier Rankings</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="h-[325px]">
            {rankings.map((ranking, index) => (
              <div key={index} className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="mr-2">{getRankLabel(index)}</div>
                  <h3 className="text-lg font-semibold">
                    {getCarrierName(ranking)}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ranking.explanation}
                </p>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
