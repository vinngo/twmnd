import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://tfnnhekkbjeqpruawcdr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbm5oZWtrYmplcXBydWF3Y2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODA5ODQsImV4cCI6MjA2Mjc1Njk4NH0.Vszy0gd8M5D1l-08FckG5RTP5eM4ebp_WGV7KGH55DI",
  );
}
