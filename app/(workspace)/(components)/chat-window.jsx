"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
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
import { CoverageDataPopup } from "./chat-window-components/state-coverage-popup";
import { SentimentDataPopup } from "./chat-window-components/sentiment-data-popup";
import { ShippingCostPopup } from "./chat-window-components/shipping-cost-popup";
import { CarrierRatePopup } from "./chat-window-components/carrier-rate-popup";

export function ChatWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [carrierRankings, setCarrierRankings] = useState([]);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [stateCoverageData, setStateCoverageData] = useState({});
  const [customerSentimentData, setCustomerSentimentData] = useState({});
  const [shippingCostData, setShippingCostData] = useState([]);
  const [carrierRateData, setCarrierRateData] = useState([]);
  const [isFetchingAdditionalData, setIsFetchingAdditionalData] =
    useState(false);

  const [activePopup, setActivePopup] = useState(null);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (carrierRankings.length > 0 && !isFetchingAdditionalData) {
      fetchAdditionalData();
    }
  }, [carrierRankings]);

  const fetchAdditionalData = async () => {
    setIsFetchingAdditionalData(true);
    try {
      const [stateCoverage, customerSentiment, shippingCost, carrierRate] =
        await Promise.all([
          fetchStateCoverageComparison(carrierRankings),
          fetchCustomerSentimentComparison(carrierRankings),
          fetchShippingCostComparison(carrierRankings),
          fetchCarrierRateComparison(carrierRankings),
        ]);

      setStateCoverageData(stateCoverage);
      setCustomerSentimentData(customerSentiment);
      setShippingCostData(shippingCost);
      setCarrierRateData(carrierRate);

      const newMessages = [
        createDataMessage("State Coverage Comparison", stateCoverage, () =>
          showPopup("stateCoverage")
        ),
        createDataMessage(
          "Customer Sentiment Comparison",
          customerSentiment,
          () => showPopup("customerSentiment")
        ),
        createDataMessage("Shipping Cost Comparison", shippingCost, () =>
          showPopup("shippingCost")
        ),
        createDataMessage("Carrier Rate Comparison", carrierRate, () =>
          showPopup("carrierRate")
        ),
      ];

      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    } catch (error) {
      console.error("Error fetching additional data:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, there was an error fetching additional data.",
        },
      ]);
    } finally {
      setIsFetchingAdditionalData(false);
    }
  };

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

        let assistantMessage;

        if (chatResponse.data.showButton) {
          assistantMessage = {
            role: "assistant",
            content:
              "I have found the following carriers that match your requirements.",
            showButton: chatResponse.data.showButton,
            handleAPI: handleCarrierRanking,
          };
        } else {
          assistantMessage = {
            role: "assistant",
            content: chatResponse.data.assistant_response,
            showButton: chatResponse.data.showButton,
            handleAPI: handleCarrierRanking,
          };
        }

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        setConversationHistory(chatResponse.data.conversation_history);
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
    setActivePopup("carrierRankings");
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

      // Add a message to inform the user that additional data is being fetched
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            "I'm now fetching additional data for these carriers. This might take a moment.",
        },
      ]);
    } catch (error) {
      console.error("Error processing carrier rankings:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, there was an error processing the carrier rankings.",
        },
      ]);
    } finally {
      setIsRankingLoading(false);
    }
  };

  const createDataMessage = (title, data, onButtonClick) => ({
    role: "assistant",
    content: `${title} data is ready for viewing.`,
    showButton: true,
    handleAPI: onButtonClick,
  });

  const showPopup = (dataType) => {
    switch (dataType) {
      case "carrierRankings":
        setActivePopup("carrierRankings");
      case "stateCoverage":
        setActivePopup("stateCoverage");
        break;
      case "customerSentiment":
        setActivePopup("customerSentiment");
        break;
      case "shippingCost":
        setActivePopup("shippingCost");
        break;
      case "carrierRate":
        setActivePopup("carrierRate");
        break;
      default:
        break;
    }
  };

  const fetchStateCoverageComparison = async (carriers) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/state-coverage-comparison/`,
        { carriers }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching state coverage data:", error);
      return null;
    }
  };

  const fetchCustomerSentimentComparison = async (carriers) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer-sentiment-comparison/`,
        { carriers }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer sentiment data:", error);
      return null;
    }
  };

  const fetchShippingCostComparison = async (carriers, num_examples) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/shipping-cost-comparison/`,
        { carriers, num_examples }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching shipping cost data:", error);
      return null;
    }
  };

  const fetchCarrierRateComparison = async (carriers, years) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/carrier-rate-comparison/`,
        { carriers, years }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching carrier rate data:", error);
      return null;
    }
  };

  const handleClosePopup = () => {
    setActivePopup(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="bg-background">
      <DialogContent
        className={`bg-[#0c171c] border-none ring-0 pt-6 ${
          activePopup ? "max-w-[900px]" : ""
        }`}
      >
        <DialogHeader>
          <DialogTitle>Chat with AI</DialogTitle>
        </DialogHeader>
        <div className="flex">
          <div className="flex flex-1 flex-col h-[400px] w-[450px]">
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
                            "View Data"
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
          {activePopup && (
            <div className="flex-1 ml-2 w-96">
              {activePopup === "stateCoverage" && (
                <CoverageDataPopup
                  data={stateCoverageData}
                  onClose={handleClosePopup}
                />
              )}
              {activePopup === "customerSentiment" && (
                <SentimentDataPopup
                  data={customerSentimentData}
                  onClose={handleClosePopup}
                />
              )}
              {activePopup === "shippingCost" && (
                <ShippingCostPopup
                  data={shippingCostData}
                  onClose={handleClosePopup}
                />
              )}
              {activePopup === "carrierRate" && (
                <CarrierRatePopup
                  data={carrierRateData}
                  onClose={handleClosePopup}
                />
              )}
              {activePopup === "carrierRankings" && (
                <CarrierRankingsPopup
                  isLoading={isRankingLoading}
                  rankings={carrierRankings}
                  onClose={handleClosePopup}
                />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
