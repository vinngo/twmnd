"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { useRecordingStore } from "@/lib/stores/useRecordingStore";
import { useTranscriptStore } from "@/lib/stores/useTranscriptStore";
import { useQuestionStore } from "@/lib/stores/useQuestionStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChatModal } from "@/components/chat-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Question } from "@/lib/types/database";

export default function NewMeetingPage() {
  const {
    startRecording,
    stopRecording,
    isRecording,
    permissionError,
    clearPermissionError,
  } = useRecordingStore();
  const { transcripts } = useTranscriptStore();
  const { questions: questionData } = useQuestionStore();
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [questions] = useState<Question[]>(questionData || []);

  useEffect(() => {
    if (permissionError) {
      setShowAlert(true);
    }
  }, [permissionError]);

  const toggleRecording = async () => {
    if (!isRecording) {
      // Start recording - in a real app, this would activate the microphone
      const success = await startRecording();
      console.log("recording started!");

      if (!success) {
        setShowAlert(true);
      }
    } else {
      await stopRecording();
    }
  };

  const renderQuestionCards = () => {
    return (
      <div className="space-y-2">
        {questions.map((question) => (
          <Card className="hover:shadow-md transition-shadow" key={question.id}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium"></h3>
                  <div></div>
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
      <div>
        {Array.isArray(transcripts) && transcripts.length > 0 ? (
          renderQuestionCards()
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Record Meeting</h2>

            {showAlert && permissionError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>{permissionError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAlert(false);
                      clearPermissionError();
                    }}
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center py-12">
              <p className="text-gray-500 mb-8">
                {isRecording
                  ? "Listening..."
                  : "Press the button below to start capturing your meeting"}
              </p>
            </div>

            {/* Recording Button */}
            <div className="flex justify-center">
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className={`rounded-full h-16 w-16 flex items-center justify-center ${
                  isRecording ? "bg-red-500 hover:bg-red-600" : ""
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>
      <ChatModal
        isOpen={chatModalOpen}
        onCloseAction={() => setChatModalOpen(false)}
      />
    </div>
  );
}
