"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMeetingsStore } from "@/lib/stores/useMeetingStore";
import { useTranscriptStore } from "@/lib/stores/useTranscriptStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AudioRecorderController from "@/components/AudioRecorderController";
import { useRecordingStore } from "@/lib/stores/useRecordingStore";
import { useNotesStore } from "@/lib/stores/useNotesStore";
import { useQuestionStore } from "@/lib/stores/useQuestionStore";
import { ChatModal } from "@/components/chat-modal";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { meetings } = useMeetingsStore();
  const { transcripts, fetchTranscriptData } = useTranscriptStore();
  const { note, error, fetchNotesData } = useNotesStore();
  const { recordingDuration } = useRecordingStore();
  const { fetchQuestionData } = useQuestionStore();
  const pathname = usePathname();
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const meeting = meetings?.filter((meeting) => meeting.id === id)[0];

  useEffect(() => {
    fetchTranscriptData(meeting?.id);
  }, [fetchTranscriptData, meeting?.id]);

  useEffect(() => {
    fetchQuestionData(meeting?.id);
  }, [fetchQuestionData, meeting?.id]);

  useEffect(() => {
    console.log("fetched from:", meeting?.id);
    fetchNotesData(meeting?.id);
    console.log(error);
  }, [error, fetchNotesData, meeting?.id]);

  useEffect(() => {
    console.log(meeting?.id);
  }, [meeting?.id, note]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <>
      <AudioRecorderController />
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
            <div className="flex items-center">
              <Link href="/dashboard/memories">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Back</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {formatTime(recordingDuration) || "0:00"}
              </div>
            </div>
          </div>
        </header>

        {/* Meeting Title and Info */}
        <div className="bg-white px-4 py-4 border-b">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-800">
              {note?.title || meeting?.title}
            </h2>
            <p className="text-gray-500 mt-1">
              {meeting?.date.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white px-4 py-2 border-b">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex space-x-2">
              <Link href={`/meetings/questions/${id}`}>
                <Button
                  variant="ghost"
                  className={`rounded-full ${pathname.includes("/meetings/questions") ? "bg-gray-200" : ""}`}
                >
                  Questions
                </Button>
              </Link>
              <Link href={`/meetings/notes/${id}`}>
                <Button
                  variant="ghost"
                  className={`rounded-full ${pathname.includes("/meetings/notes") ? "bg-gray-200" : ""}`}
                >
                  Notes
                </Button>
              </Link>
              <Link href={`/meetings/transcript/${id}`}>
                <Button
                  variant="ghost"
                  className={`rounded-full ${pathname.includes("/meetings/transcript") ? "bg-gray-200" : ""}`}
                >
                  Transcript
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>

        {/* Footer Actions */}
        <footer className="bg-white border-t py-4 px-4 sticky bottom-0">
          <div className="max-w-6xl mx-auto w-full mt-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-blue-50 text-blue-700 border-blue-200"
              onClick={() => setModalOpen(true)}
            >
              Chat with Transcript
            </Button>
          </div>
        </footer>
        <ChatModal
          isOpen={modalOpen}
          meetingId={meeting?.id}
          onCloseAction={() => setModalOpen(false)}
          transcript={transcripts}
        />
      </div>
    </>
  );
}
