"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

export function ChatWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showButton, setShowButton] = useState(false);

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

        // Check if we need to generate JSON
        // if (inputValue.toLowerCase().includes("summarize requirements")) {
        // }
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

    // Display shipping results
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="bg-background">
      <DialogContent className="sm:max-w-[425px] bg-[#0c171c] border-none ring-0 pt-6">
        <DialogHeader>
          <DialogTitle>Chat with AI</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-grow p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.content}
                  {message.role === "assistant" &&
                    showButton &&
                    index === messages.length - 1 && (
                      <div className="mt-2">
                        <Button onClick={handleCarrierRanking} size="sm">
                          Carrier Rankings
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <Input
                value={inputValue}
                disabled={isLoading || showButton}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  !isLoading &&
                  !showButton &&
                  handleSendMessage()
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
