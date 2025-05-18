"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FromCalendarClient() {
  const router = useRouter();
  const params = useSearchParams();
  const eventId = params.get("eventId");
  const title = params.get("title") || "Untitled Meeting";

  useEffect(() => {
    const createRecording = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("meetings")
        .insert({
          user_id: user.id,
          start_time: new Date(),
          date: new Date(),
          title,
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to create recording:", error.message);
        return;
      }

      router.push(`/meetings/notes/${data.id}`);
    };

    createRecording();
  }, [eventId, title, router]);

  return <p>Creating meeting from calendar event...</p>;
}
