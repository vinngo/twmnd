"use client";

import { Note } from "../types/database";
import { create } from "zustand";
import { createClient } from "../supabase/client";

interface NotesData {
  note: Note | null;
  loading: boolean;
  error: string | null;
  fetchNotesData: (meeting_id: string | undefined) => Promise<void>;
  updateNoteInStore: (note: Note) => void;
}

export const useNotesStore = create<NotesData>((set, get) => ({
  note: null,
  loading: false,
  error: null,

  fetchNotesData: async (meeting_id: string | undefined) => {
    if (!meeting_id) return;

    const supabase = createClient();
    set({ loading: true });

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("meeting_id", meeting_id)
      .single();

    if (error) return set({ note: null, error: error.message, loading: false });

    set({ note: data, loading: false });

    // Set up realtime subscription
    supabase
      .channel(`realtime:note:${meeting_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `meeting_id=eq.${meeting_id}`,
        },
        (payload) => {
          const updatedNote = payload.new as Note;
          get().updateNoteInStore(updatedNote);
        },
      )
      .subscribe();
  },

  updateNoteInStore: (note: Note) => {
    set({ note });
  },
}));
