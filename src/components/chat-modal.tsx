"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Question as Message } from "@/lib/types/database";
import { Transcript } from "@/lib/types/database";

class Question {
  role: string;
  content: string;

  constructor(role: string, content: string) {
    this.role = role;
    this.content = content;
  }
}

type QuickPrompt = {
  text: string;
  action: () => void;
};

interface ChatModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  meetingId?: string;
  transcript?: Transcript[] | null;
  prevMessages?: Message[] | undefined;
  initialPrompts?: QuickPrompt[];
}

export function ChatModal({
  isOpen,
  onCloseAction,
  meetingId,
  transcript,
  prevMessages,
  initialPrompts,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Question[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInitialView, setShowInitialView] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevMessages && prevMessages.length > 0) {
      const messageToQuestion = [];
      for (const message of prevMessages) {
        messageToQuestion.push(new Question("user", message.user_input));
        messageToQuestion.push(new Question("assistant", message.ai_response));
      }
      setMessages(messageToQuestion);
      setShowInitialView(false);
    }
  }, [prevMessages]);

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setShowInitialView(false);
    handleSendMessage(prompt);
  };

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

  const handleSendMessage = async (
    messageText?: string,
    followup?: boolean,
  ) => {
    const message = messageText || input;
    if (!message.trim()) return;

    // Clear messages if it's a followup reset
    if (followup) {
      setMessages([{ role: "user", content: message }]);
    } else {
      setMessages((prev) => [...prev, { role: "user", content: message }]);
    }

    setInput("");
    setIsLoading(true);
    setShowInitialView(false);

    // Convert transcript to plain text
    let transcriptText = "";
    if (transcript && transcript.length > 0) {
      for (const transcriptItem of transcript) {
        transcriptText += transcriptItem.text;
      }
    }

    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: message,
          meeting_id: meetingId,
          transcript: transcriptText,
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulated = "";

      // Push empty assistant message to start streaming into
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        // Update the latest assistant message with streamed text
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: accumulated,
            };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
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

  const handleKeyDown = (e: React.KeyboardEvent, followup: boolean) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (followup) {
        handleSendMessage(undefined, followup);
      } else {
        handleSendMessage();
      }
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
            <DialogTitle className="text-xl font-semibold">
              {messages[0].content.length > 50
                ? `${messages[0].content.substring(0, 50)}...`
                : messages[0].content}
            </DialogTitle>
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
                onKeyDown={(e) => handleKeyDown(e, false)}
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
                  onKeyDown={(e) => handleKeyDown(e, true)}
                />
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={() => handleSendMessage(undefined, true)}
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
