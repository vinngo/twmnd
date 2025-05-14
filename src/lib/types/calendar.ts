export type CalendarEvent = {
  id: string;
  summary: string;
  start: string;
  end: string | null;
  description?: string;
  location?: string;
};
