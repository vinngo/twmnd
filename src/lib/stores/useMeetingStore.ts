import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "../supabase/client";
import { User, Meeting } from "../types/database";

interface MeetingsData {
  user: User | null;
  meetings: Meeting[] | null;
  loading: boolean;
  error: string | null;
  fetchMeetingsData: () => Promise<void>;
}

export const useMeetingsStore = create<MeetingsData>()(
  persist(
    (set) => ({
      user: null,
      meetings: [],
      loading: true,
      error: null,

      async fetchMeetingsData() {
        try {
          const supabase = createClient();
          set({ loading: true, error: null });

          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (!user || userError) {
            throw new Error("User not authenticated!");
          }

          const { data: appUser } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          const { data: meetingsData, error: meetingsError } = await supabase
            .from("meetings")
            .select("*")
            .eq("user_id", user.id);

          if (meetingsError) {
            throw new Error("Failed to fetch meetings!");
          }

          set({
            user: appUser,
            meetings: meetingsData,
            loading: false,
            error: null,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Unknown error";
          set({ loading: false, error: message });
        }
      },
    }),
    { name: "dashboard_meetings" },
  ),
);
