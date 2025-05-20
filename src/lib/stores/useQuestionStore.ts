import { Question } from "../types/database";
import { createClient } from "../supabase/client";
import { create } from "zustand";

interface QuestionData {
  questions: Question[] | undefined;
  loading: boolean;
  error: string | null;
  fetchQuestionData: (meeting_id: string | undefined) => Promise<void>;
}

export const useQuestionStore = create<QuestionData>((set) => ({
  questions: undefined,
  loading: false,
  error: null,
  fetchQuestionData: async (meeting_id: string | undefined) => {
    if (!meeting_id) return;
    try {
      set({ loading: true });
      const { data, error } = await createClient()
        .from("questions")
        .select("*")
        .eq("meeting_id", meeting_id);
      if (error) throw error;
      set({ questions: data, loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));
