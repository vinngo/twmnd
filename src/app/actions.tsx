"use server";

import { createClient } from "@/lib/supabase/server";

export async function loginWithGoogle() {
  const supabase = await createClient();

  try {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (!data.url) {
      throw new Error("Couldn't get Google login URL");
    }
    return { succes: true, url: data.url, error: null };
  } catch (e) {
    console.error("Could not sign in with Google!", e);
    return { succes: false, error: e };
  }
}
