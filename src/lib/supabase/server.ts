import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    "https://tfnnhekkbjeqpruawcdr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbm5oZWtrYmplcXBydWF3Y2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODA5ODQsImV4cCI6MjA2Mjc1Njk4NH0.Vszy0gd8M5D1l-08FckG5RTP5eM4ebp_WGV7KGH55DI",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
