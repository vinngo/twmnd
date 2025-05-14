"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Mock meeting data - in a real app, this would come from a database
  const meeting = {
    title: "Weekly Team Sync",
    date: "May 14, 2025",
    time: "1:05 PM",
    location: "Santa Cruz, CA",
  };

  return (
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
              00:01
            </div>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Meeting Title and Info */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-2xl font-bold text-gray-800">{meeting.title}</h2>
          <p className="text-gray-500 mt-1">
            {meeting.date} • {meeting.time} • {meeting.location}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-4 py-2 border-b">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex space-x-2">
            <Link href="/meetings/questions">
              <Button
                variant="ghost"
                className={`rounded-full ${pathname === "/meetings/questions" ? "bg-gray-200" : ""}`}
              >
                Questions
              </Button>
              <Link href="/meetings/notes">
                <Button
                  variant="ghost"
                  className={`rounded-full ${pathname === "/meetings/notes" ? "bg-gray-200" : ""}`}
                >
                  Notes
                </Button>
              </Link>
              <Link href="/meetings/transcript">
                <Button
                  variant="ghost"
                  className={`rounded-full ${pathname === "/meetings/transcript" ? "bg-gray-200" : ""}`}
                >
                  Transcript
                </Button>
              </Link>
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
        <div className="max-w-6xl mx-auto w-full flex justify-between">
          <Button variant="outline" size="lg" className="flex-1 mr-2">
            Edit Notes
          </Button>
          <Button size="lg" className="flex-1 ml-2">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        <div className="max-w-6xl mx-auto w-full mt-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-blue-50 text-blue-700 border-blue-200"
          >
            Chat with Transcript
          </Button>
        </div>
      </footer>
    </div>
  );
}
