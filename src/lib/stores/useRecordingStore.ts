import { create } from "zustand";
import { createMeeting, endMeeting } from "../services/meetingService";

interface RecordingData {
  isRecording: boolean;
  stream: MediaStream | null;
  recordingDuration: number;
  meeting_id: string | null;
  chunkIndex: number;
  permissionError: string | null;
  setRecordingDuration: (value: number | ((prev: number) => number)) => void;
  setChunkIndex: (value: number | ((prev: number) => number)) => void;
  startRecording: () => Promise<boolean>;
  stopRecording: () => Promise<void>;
  clearPermissionError: () => void;
}

export const useRecordingStore = create<RecordingData>((set, get) => ({
  isRecording: false,
  stream: null,
  meeting_id: null,
  recordingDuration: 0,
  chunkIndex: 0,
  permissionError: null,

  setRecordingDuration: (value) =>
    set((state) => ({
      recordingDuration:
        typeof value === "function" ? value(state.recordingDuration) : value,
    })),

  setChunkIndex: (value) =>
    set((state) => ({
      chunkIndex: typeof value === "function" ? value(state.chunkIndex) : value,
    })),

  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const { data } = await createMeeting();
      set({
        stream,
        isRecording: true,
        meeting_id: data.id,
        permissionError: null,
      });
      return true;
    } catch (error) {
      console.error("Error getting microphone permission:", error);
      let errorMessage = "Failed to access microphone";

      if (error instanceof DOMException) {
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          errorMessage = "Microphone permission denied";
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          errorMessage = "No microphone found";
        }
      }

      set({ permissionError: errorMessage });
      return false;
    }
  },

  stopRecording: async () => {
    get()
      .stream?.getTracks()
      .forEach((t) => t.stop());
    set({
      isRecording: false,
      stream: null,
      recordingDuration: 0,
      chunkIndex: 0,
    });
    await endMeeting(get().meeting_id);
  },

  clearPermissionError: () => {
    set({ permissionError: null });
  },
}));
