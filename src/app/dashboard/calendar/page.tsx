"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useMeetingsStore } from "@/lib/stores/useMeetingStore";
import { useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/app/page";
import { attemptSyncCalendar } from "./actions";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user, meetings, loading, fetchMeetingsData } = useMeetingsStore();

  useEffect(() => {
    fetchMeetingsData();
  }, [fetchMeetingsData]);

  const handleLoginWithGoogle = async () => {
    const { url } = await attemptSyncCalendar();
    if (url) {
      console.log(url);
    }
    //@ts-expect-error idc
    window.location.href = url;
  };

  // Function to check if a date has meetings
  const hasMeetings = (day: Date) => {
    if (!meetings) return false;

    return meetings.some((meeting) => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getDate() === day.getDate() &&
        meetingDate.getMonth() === day.getMonth() &&
        meetingDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // Get meetings for the selected date
  const meetingsForSelectedDate = date
    ? meetings?.filter((meeting) => {
        const meetingDate = new Date(meeting.date);
        return (
          meetingDate.getDate() === date.getDate() &&
          meetingDate.getMonth() === date.getMonth() &&
          meetingDate.getFullYear() === date.getFullYear()
        );
      })
    : [];

  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <Card>
          {user?.calendar_connected ? (
            <>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>View your meetings by date</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border mx-auto"
                  modifiers={{
                    hasMeeting: (day) => hasMeetings(day),
                  }}
                  modifiersClassNames={{
                    hasMeeting: "bg-blue-100 font-bold text-blue-700",
                  }}
                />
              </CardContent>
            </>
          ) : (
            <Button
              onClick={handleLoginWithGoogle}
              className="flex items-center gap-2 px-6 py-5"
            >
              <GoogleIcon />
              <span>Sync Your Calendar</span>
            </Button>
          )}
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {date?.toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </CardTitle>
              <CardDescription>
                {meetingsForSelectedDate?.length || 0} meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-100 animate-pulse rounded-md"
                    ></div>
                  ))}
                </div>
              ) : meetingsForSelectedDate &&
                meetingsForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {meetingsForSelectedDate.map((meeting) => (
                    <Link
                      href={`/meetings/notes/${meeting.id}`}
                      key={meeting.id}
                      className="block"
                    >
                      <div className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{meeting.title}</h3>
                            <div className="text-sm text-gray-500">
                              {new Date(meeting.start_time).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                              {" - "}
                              {new Date(meeting.end_time).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </div>
                          </div>
                          <Badge variant="outline">View</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-2">No meetings for this day</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
