"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

export default function NewMeetingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording - in a real app, this would activate the microphone
      setIsRecording(true);

      // Mock adding transcription chunks
      const mockTranscript = [
        "Hi everyone, thanks for joining today's meeting.",
        "Let's start by reviewing our progress from last week.",
        "John, could you share an update on the design work?",
      ];

      let index = 0;
      const transcriptInterval = setInterval(() => {
        if (index < mockTranscript.length) {
          setTranscription((prev) => [...prev, mockTranscript[index]]);
          index++;
        } else {
          clearInterval(transcriptInterval);
        }
      }, 3000);
    } else {
      // Stop recording
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Record Meeting</h2>

        {/* Live Transcription */}
        {transcription.length > 0 ? (
          <div className="space-y-3 mb-6">
            {transcription.map((text, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-3 text-sm">{text}</CardContent>
              </Card>
            ))}
            {isRecording && (
              <div className="flex items-center text-sm text-gray-500 pl-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                <span>Listening...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-8">
              {isRecording
                ? "Listening..."
                : "Press the button below to start capturing your meeting"}
            </p>
          </div>
        )}

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
      </div>
    </div>
  );
}
