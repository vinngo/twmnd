"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "../supabase/client";
import { Transcript } from "../types/database";

interface TranscriptData {
  transcripts: Transcript[] | null;
  loading: boolean;
  error: string | null;
  fetchTranscriptData: () => Promise<void>;
}

export const useTranscriptStore = create<TranscriptData>()(
  persist(
    (set) => ({
      transcripts: null,
      loading: true,
      error: null,
      async fetchTranscriptData() {
        const supabase = createClient();
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (!user || userError) {
            throw new Error("User not authenticated");
          }

          const { data: transcriptsData, error: transcriptsError } =
            await supabase
              .from("transcripts")
              .select("*")
              .eq("user_id", user.id);

          if (transcriptsError) {
            throw new Error("Failed to fetch transcripts!");
          }

          set({
            transcripts: transcriptsData,
            loading: false,
            error: null,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Unknown error";
          set({ loading: false, error: message });
        }
      },
    }),
    { name: "transcripts" },
  ),
);
