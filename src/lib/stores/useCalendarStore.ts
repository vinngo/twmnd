import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { CalendarEvent } from "../types/calendar";

interface CalendarEventData {
  events: CalendarEvent[] | null;
  loading: boolean;
  error: string | null;
  fetchCalendarData: () => Promise<void>;
}

export const useCalendarStore = create<CalendarEventData>()(
  persist(
    (set) => ({
      events: null,
      loading: true,
      error: null,
      async fetchCalendarData() {
        try {
          const res = await axios.get("/api/calendar/events");
          set({
            events: res.data.events,
            loading: false,
          });
        } catch (error: any) {
          set({
            events: null,
            loading: false,
            error: error.message,
          });
        }
      },
    }),
    { name: "calendar_events" },
  ),
);
