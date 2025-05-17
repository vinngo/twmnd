"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { useRecordingStore } from "@/lib/stores/useRecordingStore";
import { useTranscriptStore } from "@/lib/stores/useTranscriptStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NewMeetingPage() {
  const {
    startRecording,
    stopRecording,
    isRecording,
    permissionError,
    clearPermissionError,
  } = useRecordingStore();
  const { transcripts } = useTranscriptStore();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (permissionError) {
      setShowAlert(true);
    }
  }, [permissionError]);

  useEffect(() => {
    console.log("recording:", isRecording);
  });

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

  return (
    <div className="space-y-6">
      <div>
        {Array.isArray(transcripts) && transcripts.length > 0 ? (
          <div>Questions</div>
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
    </div>
  );
}
