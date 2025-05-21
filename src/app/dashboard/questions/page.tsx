"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuestionStore } from "@/lib/stores/useQuestionStore";
import { useTranscriptStore } from "@/lib/stores/useTranscriptStore";
import { ChatModal } from "@/components/chat-modal";
import { Question } from "@/lib/types/database";

export default function QuestionsPage() {
  const { questions: questionData, fetchQuestionData } = useQuestionStore();
  const { transcripts, fetchTranscriptData } = useTranscriptStore();
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<
    Question | undefined
  >(undefined);
  const [questions] = useState<Question[]>(questionData || []);

  useEffect(() => {
    fetchQuestionData(undefined);
  }, [fetchQuestionData]);

  useEffect(() => {
    if (selectedQuestion) {
      fetchTranscriptData(selectedQuestion.meeting_id);
    }
  }, [selectedQuestion, fetchTranscriptData]);

  const handleCardClick = (question: Question) => {
    setSelectedQuestion(question);
    setChatModalOpen(true);
  };

  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="sticky top-24">
            <div className="space-y-2">
              {questions && questions.length > 0 ? (
                questions.map((question) => (
                  <Card
                    className="hover:shadow-md transition-shadow"
                    key={question.id}
                    onClick={() => handleCardClick(question)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{question.user_input}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center">
                  <p>No questions asked yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <ChatModal
          isOpen={chatModalOpen}
          prevMessages={selectedQuestion ? [selectedQuestion] : undefined}
          onCloseAction={() => setChatModalOpen(false)}
          meetingId={selectedQuestion?.meeting_id}
          transcript={transcripts}
        />
      </div>
    </main>
  );
}
