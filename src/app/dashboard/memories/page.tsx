"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  SquareMIcon as MicSquare,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useEffect } from "react";
import { useMeetingsStore } from "@/lib/stores/useMeetingStore";

export default function MemoriesPage() {
  const { meetings, loading, fetchMeetingsData } = useMeetingsStore();

  useEffect(() => {
    fetchMeetingsData();
  }, [fetchMeetingsData]);

  useEffect(() => {
    if (meetings) {
      console.log(meetings);
    }
  }, [meetings]);

  const isToday = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  const classifyDate = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  function getMeetingDuration(
    start: string | Date,
    end: string | Date,
  ): number {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    return Math.round(durationMs / 60000); // minutes
  }

  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return [hours > 0 ? `${hours}h` : null, mins > 0 ? `${mins}m` : null]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
      {/* Search and Capture */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search memories..." className="pl-9" />
        </div>

        <Link href="/meetings/new">
          <Button className="flex items-center gap-2">
            <MicSquare className="h-4 w-4" />
            <span>Capture</span>
          </Button>
        </Link>
      </div>

      {/* Meeting Groups */}
      <div className="space-y-6">
        {loading ? (
          // Loading state
          <div className="space-y-3">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <Card className="animate-pulse">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="w-full">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : meetings && meetings.length > 0 ? (
          // Group meetings by date
          Object.entries(
            meetings.reduce(
              (groups, meeting) => {
                // Ensure meeting.date is properly handled
                const dateKey = classifyDate(meeting.date);
                if (!groups[dateKey]) {
                  groups[dateKey] = [];
                }
                groups[dateKey].push(meeting);
                return groups;
              },
              {} as Record<string, typeof meetings>,
            ),
          ).map(([dateGroup, groupMeetings]) => (
            <div key={dateGroup}>
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                {dateGroup}
              </h2>
              <div className="space-y-2">
                {groupMeetings.map((meeting) => (
                  <Link
                    href={`/meetings/notes/${meeting.id}`}
                    key={meeting.id}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{meeting.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>
                                {new Date(meeting.start_time).getHours() %
                                  12 || 12}
                                :
                                {new Date(meeting.start_time)
                                  .getMinutes()
                                  .toString()
                                  .padStart(2, "0")}
                              </span>
                              <span className="mx-1">•</span>
                              <span>
                                {formatDuration(
                                  getMeetingDuration(
                                    new Date(meeting.start_time),
                                    new Date(meeting.end_time),
                                  ),
                                )}
                              </span>
                            </div>
                          </div>
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          // No meetings found
          <div className="text-center py-10">
            <div className="rounded-full bg-gray-100 p-3 inline-flex mb-4">
              <Clock className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No meetings yet</h3>
            <p className="text-gray-500 mb-4">
              Your captured meetings will appear here
            </p>
            <Link href="/meetings/new">
              <Button>
                <MicSquare className="h-4 w-4 mr-2" />
                Capture a meeting
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}