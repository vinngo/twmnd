"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type QuickPrompt = {
  text: string;
  action: () => void;
};

interface ChatModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  meetingId?: string;
  meetingTitle?: string;
  initialPrompts?: QuickPrompt[];
}

export function ChatModal({
  isOpen,
  onCloseAction,
  meetingId = "",
  initialPrompts,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInitialView, setShowInitialView] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default quick prompts if none provided
  const defaultPrompts: QuickPrompt[] = [
    {
      text: "Summarize everything in great detail",
      action: () => handleQuickPrompt("Summarize everything in great detail"),
    },
    {
      text: "What did I miss in this conversation?",
      action: () => handleQuickPrompt("What did I miss in this conversation?"),
    },
    {
      text: "Key decisions made?",
      action: () => handleQuickPrompt("Key decisions made?"),
    },
  ];

  const quickPrompts = initialPrompts || defaultPrompts;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, showInitialView]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setShowInitialView(false);
    handleSendMessage(prompt);
  };

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || input;
    if (!message.trim()) return;

    // Add user message to state
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsLoading(true);
    setShowInitialView(false);

    try {
      const res = await axios.post("/api/ask", {
        input: message,
        meeting_id: meetingId,
        transcript: messages.map((m) => m.content).join("\n"), // Simple way to build context
      });

      const ai_response = res.data?.question?.ai_response;

      if (!ai_response) {
        throw new Error("No response from assistant.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: ai_response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCloseAction();
      }}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl p-0 gap-0 h-[80vh] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center">
          {!showInitialView && messages.length > 0 && (
            <h2 className="text-xl font-semibold">
              {messages[0].content.length > 50
                ? `${messages[0].content.substring(0, 50)}...`
                : messages[0].content}
            </h2>
          )}
        </div>

        {/* Initial View with Input and Quick Prompts */}
        {showInitialView ? (
          <div className="flex-1 flex flex-col p-4">
            <div className="relative mb-6">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about this transcript..."
                className="w-full border-b border-gray-200 py-2 pl-2 pr-10 text-lg focus:outline-none focus:border-blue-500"
                onKeyDown={handleKeyDown}
              />
              {input && (
                <Button
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2"
                  onClick={() => handleSendMessage()}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-end">
              <div className="space-y-4">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={prompt.action}
                    className="w-full text-left py-4 px-4 flex justify-between items-center hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-gray-700">{prompt.text}</span>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "mb-4 max-w-[85%]",
                    message.role === "user" ? "ml-auto" : "",
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-4">
                  <div className="bg-gray-100 p-3 rounded-lg inline-block">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask follow up..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={handleKeyDown}
                />
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
