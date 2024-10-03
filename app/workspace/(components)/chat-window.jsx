"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { CarrierRankingsPopup } from "./chat-window-components/carrier-ranking-popup";

export function ChatWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [carrierRankings, setCarrierRankings] = useState([]);
  const [showRankings, setShowRankings] = useState(false);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [stateCoverageData, setStateCoverageData] = useState({});
  const [customerSentimentData, setCustomerSentimentData] = useState({});
  const [shippingCostData, setShippingCostData] = useState([]);
  const [carrierRateData, setCarrierRateData] = useState([]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setIsLoading(true);
      const newUserMessage = { role: "user", content: inputValue };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInputValue("");

      try {
        // Send message to chat API
        const chatResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
          {
            user_message: inputValue,
            conversation_history: conversationHistory,
          }
        );

        console.log(chatResponse.data);

        const assistantMessage = {
          role: "assistant",
          content: chatResponse.data.assistant_response,
          showButton: chatResponse.data.showButton,
          handleAPI: handleCarrierRanking,
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        setConversationHistory(chatResponse.data.conversation_history);
        setShowButton(chatResponse.data.showButton);
      } catch (error) {
        console.error("Error processing message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCarrierRanking = async () => {
    setIsRankingLoading(true);
    setShowRankings(true);
    try {
      const jsonResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-json`,
        {
          conversation_history: conversationHistory,
        }
      );

      console.log("JSON response:", jsonResponse.data);

      // Process shipping requirements
      const shippingResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/process-shipping`,
        {
          ...jsonResponse.data.requirements,
        }
      );

      console.log("Shipping response:", shippingResponse.data);
      setCarrierRankings(shippingResponse.data.ranked_vendors);

      // Fetch data for other APIs
      await fetchStateCoverageComparison(["UPS", "FedEx"]);
      await fetchCustomerSentimentComparison(["UPS", "FedEx"]);
      await fetchShippingCostComparison(["UPS", "FedEx"], 5);
      await fetchCarrierRateComparison(["UPS", "FedEx"], 4);
    } catch (error) {
      console.error("Error processing carrier rankings:", error);
    } finally {
      setIsRankingLoading(false);
    }
  };

  const fetchStateCoverageComparison = async (carriers) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/state-coverage-comparison/`,
        { carriers }
      );
      setStateCoverageData(response.data);
    } catch (error) {
      console.error("Error fetching state coverage data:", error);
    }
  };

  const fetchCustomerSentimentComparison = async (carriers) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer-sentiment-comparison/`,
        { carriers }
      );
      setCustomerSentimentData(response.data);
    } catch (error) {
      console.error("Error fetching customer sentiment data:", error);
    }
  };

  const fetchShippingCostComparison = async (carriers, num_examples) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/shipping-cost-comparison/`,
        { carriers, num_examples }
      );
      setShippingCostData(response.data.data);
    } catch (error) {
      console.error("Error fetching shipping cost data:", error);
    }
  };

  const fetchCarrierRateComparison = async (carriers, years) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/carrier-rate-comparison/`,
        { carriers, years }
      );
      setCarrierRateData(response.data.data);
    } catch (error) {
      console.error("Error fetching carrier rate data:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="bg-background">
      <DialogContent
        className={`bg-[#0c171c] border-none ring-0 pt-6 ${
          showRankings ? "max-w-[900px]" : ""
        }`}
      >
        <DialogHeader>
          <DialogTitle>Chat with AI</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4">
          <div className="flex flex-1 flex-col h-[400px] max-w-[450px]">
            <ScrollArea className="flex-grow p-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block py-2 px-3 rounded-[10px] ${
                      message.role === "user"
                        ? "bg-[#1E3A5F] text-white"
                        : "bg-secondary"
                    }`}
                  >
                    {message.content}
                    {message.role === "assistant" && message.showButton && (
                      <div className="my-3">
                        <Button
                          onClick={message.handleAPI}
                          size="sm"
                          className="rounded-[10px]"
                          disabled={isRankingLoading}
                        >
                          {isRankingLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Carrier Rankings"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t border-border"></div>
            <div className="flex items-center">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                className="ml-2 bg-[#1E3A5F] text-white"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {showRankings && (
            <div className="flex-1">
              <CarrierRankingsPopup
                rankings={carrierRankings}
                onClose={() => setShowRankings(false)}
                isLoading={isRankingLoading}
                stateCoverageData={stateCoverageData}
                customerSentimentData={customerSentimentData}
                interactiveComparisonData={interactiveComparisonData}
                shippingCostData={shippingCostData}
                carrierRateData={carrierRateData}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
