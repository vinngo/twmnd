"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMeetingsStore } from "@/lib/stores/useMeetingStore";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/google-icon";
import { attemptSyncCalendar } from "./actions";
import { useCalendarStore } from "@/lib/stores/useCalendarStore";
import { Clock, MessageSquare } from "lucide-react";

export default function CalendarPage() {
  const { user, fetchMeetingsData } = useMeetingsStore();
  const { events, fetchCalendarData } = useCalendarStore();

  useEffect(() => {
    fetchMeetingsData();
  }, [fetchMeetingsData]);

  useEffect(() => {
    if (user?.calendar_connected) {
      fetchCalendarData();
    }
  }, [user?.calendar_connected, fetchCalendarData]);

  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleLoginWithGoogle = async () => {
    const { url } = await attemptSyncCalendar();
    if (url) {
      console.log(url);
    }
    //@ts-expect-error idc
    window.location.href = url;
  };

  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <Card>
          {user?.calendar_connected ? (
            <>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>View your meetings by date</CardDescription>
                {events && events.length > 0 ? (
                  events.map((event) => {
                    return (
                      <Link
                        href={`/meetings/from-event?eventId=${event.id}&title=${encodeURIComponent(event.summary + " Recording")}`}
                        key={event.id}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{event.summary}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  <span>
                                    {new Date(
                                      //@ts-expect-error this actually exists on the event object
                                      event.start.dateTime,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <MessageSquare className="h-5 w-5 text-gray-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="font-medium">No Events</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You have no meetings scheduled.
                      </p>
                    </div>
                  </div>
                )}
              </CardHeader>
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
      </div>
    </main>
  );
}
