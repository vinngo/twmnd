"use server";

import { createClient } from "@/lib/supabase/server";

export async function loginWithGoogle() {
  const supabase = await createClient();

  try {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.PROD === "true"
            ? "https://twmnd.vercel.app/auth/callback"
            : "http://localhost:3000/auth/callback",
        scopes: "https://www.googleapis.com/auth/calendar.readonly",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (!data.url) {
      throw new Error("Couldn't get Google login URL");
    }
    return { success: true, url: data.url, error: null };
  } catch (e) {
    console.error("Could not sign in with Google!", e);
    return { succes: false, error: e };
  }
}
