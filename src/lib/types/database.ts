export interface User {
  id: string;
  email: string;
  name: string;
  calendar_connected: boolean;
  google_access_token: string;
  google_refresh_token: string;
}

export interface Meeting {
  id: string;
  user_id: string;
  start_time: Date;
  end_time: Date;
  date: Date;
  title: string;
}

export interface Transcript {
  id: string;
  meeting_id: string;
  text: string;
}

export interface ChatLog {
  id: string;
  meeting_id: string;
  user_input: string;
  ai_reseponse: string;
  timestamp: Date;
}
