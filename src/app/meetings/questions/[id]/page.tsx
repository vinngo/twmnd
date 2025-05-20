"use client";

import { useState, useEffect } from "react";
import { useQuestionStore } from "@/lib/stores/useQuestionStore";
import { useMeetingsStore } from "@/lib/stores/useMeetingStore";
import { useTranscriptStore } from "@/lib/stores/useTranscriptStore";
import { ChatModal } from "@/components/chat-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Question } from "@/lib/types/database";
import { useParams } from "next/navigation";

export default function QuestionsPage() {
  const { questions: questionData, fetchQuestionData } = useQuestionStore();
  const { meetings } = useMeetingsStore();
  const { transcripts } = useTranscriptStore();
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [questions] = useState<Question[]>(questionData || []);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const { id } = useParams();

  const meeting = meetings?.find((meeting) => meeting.id === id);

  useEffect(() => {
    fetchQuestionData(meeting?.id);
  }, [fetchQuestionData, meeting?.id]);

  const handleCardClick = (question: Question) => {
    setSelectedQuestion(question);
    setChatModalOpen(true);
  };

  const renderQuestionCards = () => {
    return (
      <div className="space-y-2">
        {questions.map((question) => (
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            key={question.id}
            onClick={() => handleCardClick(question)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">{"❓" + question.user_input}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>{renderQuestionCards()}</div>
      <ChatModal
        isOpen={chatModalOpen}
        prevMessages={selectedQuestion ? [selectedQuestion] : undefined}
        onCloseAction={() => setChatModalOpen(false)}
        meetingId={meeting?.id}
        transcript={transcripts}
      />
    </div>
  );
}
