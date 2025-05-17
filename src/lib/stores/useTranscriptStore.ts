"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "../supabase/client";
import { Transcript } from "../types/database";

interface TranscriptData {
  transcripts: Transcript[] | null;
  loading: boolean;
  error: string | null;
  fetchTranscriptData: (meeting_id: string | undefined) => Promise<void>;
}

export const useTranscriptStore = create<TranscriptData>()(
  persist(
    (set) => ({
      transcripts: null,
      loading: true,
      error: null,
      async fetchTranscriptData(meeting_id: string | undefined) {
        if (!meeting_id) {
          set({ loading: false, error: "Meeting ID is required!" });
          return;
        }

        const supabase = createClient();
        try {
          const { data: transcriptsData, error: transcriptsError } =
            await supabase
              .from("transcripts")
              .select("*")
              .eq("meeting_id", meeting_id);

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
