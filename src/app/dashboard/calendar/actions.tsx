"use server";
import { createClient } from "@/lib/supabase/server";

export async function attemptSyncCalendar() {
  const supabase = await createClient();

  try {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar.readonly",
        redirectTo:
          process.env.PROD === "true"
            ? "https://twmnd.vercel.app/dashboard/calendar/callback"
            : "http://localhost:3000/dashboard/calendar/callback",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (!data.url) {
      throw new Error("Could not get URL for Google Calendar login");
    }

    return { success: true, url: data.url, error: null };
  } catch (e) {
    console.error("Could not login to sync Google Calendar!", e);
    return { success: false, error: e };
  }
}
