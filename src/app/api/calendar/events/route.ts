import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getCalendarEvents, refreshAccessToken } from "../fetchCalendarData";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: appUser, error } = await supabase
    .from("users")
    .select("google_access_token, google_refresh_token")
    .eq("id", userId)
    .single();

  if (error || !appUser?.google_access_token) {
    return NextResponse.json({ error: "User not found" }, { status: 403 });
  }

  const accessToken = appUser.google_access_token;

  try {
    const events = await getCalendarEvents(accessToken);
    return NextResponse.json({ events });
  } catch (error: any) {
    if (error.message === "access_token_expired") {
      const tokenData = await refreshAccessToken(appUser.google_refresh_token);

      await supabase
        .from("users")
        .update({ google_access_token: tokenData.access_token })
        .eq("id", userId);

      const events = await getCalendarEvents(tokenData.access_token);
      return NextResponse.json({ events });
    }
  }

  return NextResponse.json(
    { error: "Failed to fetch calendar events" },
    { status: 500 },
  );
}
