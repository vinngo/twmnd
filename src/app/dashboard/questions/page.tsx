"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMeetingsStore } from "@/lib/stores/useMeetingStore";
import { ArrowRight, MessageSquare, SearchIcon, Share2, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionsPage() {
  const { meetings, loading } = useMeetingsStore();
  const [question, setQuestion] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  
  // Mock questions history
  const questionsHistory = [
    {
      id: 1,
      question: "What were the main topics we discussed in last week's meeting?",
      answer: "In last week's meeting, the team primarily discussed three main topics: (1) Q2 product roadmap priorities, (2) upcoming customer feedback implementation, and (3) resource allocation for the new feature development.",
      timestamp: new Date("2023-05-15T14:30:00")
    },
    {
      id: 2,
      question: "Summarize our decision about the marketing budget.",
      answer: "The team decided to increase the Q3 marketing budget by 15% to support the new product launch. This includes additional allocations for digital advertising, event sponsorships, and hiring an external PR consultant for the first three months of the campaign.",
      timestamp: new Date("2023-05-12T10:15:00")
    }
  ];

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    setIsAskingQuestion(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      setIsAskingQuestion(false);
      // In a real app, you'd save the response
    }, 3000);
  };

  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-xl font-bold mb-4">Ask Questions About Your Meetings</h2>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-4">
                <Textarea 
                  placeholder="Ask a question about any of your meetings..." 
                  className="min-h-24 resize-none"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleAskQuestion}
                  disabled={isAskingQuestion || !question.trim()}
                >
                  {isAskingQuestion ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Ask Question
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Previous Questions</h3>
            
            {questionsHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 py-3 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.question}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-3 px-4">
                  <p>{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Recent Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3 pr-3">
                      {meetings && meetings.length > 0 ? (
                        meetings.slice(0, 5).map((meeting) => (
                          <div key={meeting.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                            <div className="bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center">
                              <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{meeting.title}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(meeting.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-10">No meetings found</p>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Suggested Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "What were the action items from our last meeting?",
                    "Who was responsible for the marketing presentation?",
                    "Summarize the key decisions we made about the new product launch",
                    "What feedback did the team give about the prototype?"
                  ].map((suggestion, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start h-auto py-2 px-3 text-left"
                      onClick={() => setQuestion(suggestion)}
                    >
                      <SearchIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{suggestion}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}