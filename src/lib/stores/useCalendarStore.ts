/*

import { create } from "zustand";
import { persist } from "zustand/middleware";
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
        set();
      },
    }),
    { name: "calendar_events" },
  ),
);
*/
