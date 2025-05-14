"use server";

import { createClient } from "@/lib/supabase/server";

export async function authUserSetup() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Failed to get user after login!", error);
    return;
  }

  const { data: exists } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!exists) {
    await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
      calendar_connected: false,
    });
  }
}
