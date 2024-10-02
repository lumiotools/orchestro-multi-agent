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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

const CarrierRankingsPopup = ({ rankings, onClose }) => {
  return (
    <Card className="w-full bg-background border-none">
      <CardHeader className="py-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Carrier Rankings</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {rankings.map((carrier, index) => (
            <div key={index} className="mb-2">
              <div className="font-semibold">{carrier.name}</div>
              <div className="text-sm text-muted-foreground">
                Score: {carrier.score}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export function ChatWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [carrierRankings, setCarrierRankings] = useState([]);
  const [showRankings, setShowRankings] = useState(false);

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
      setShowRankings(true);
    } catch (error) {
      console.error("Error processing carrier rankings:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`bg-background border-none ring-0 pt-6 ${
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
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {message.content}
                    {message.role === "assistant" &&
                      showButton &&
                      index === messages.length - 1 && (
                        <div className="my-3">
                          <Button
                            onClick={handleCarrierRanking}
                            size="sm"
                            className="rounded-[10px]"
                          >
                            Carrier Rankings
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
                disabled={isLoading}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) =>
                  e.key === "Enter" && !isLoading && handleSendMessage()
                }
              />
              <Button
                className="ml-2"
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
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
