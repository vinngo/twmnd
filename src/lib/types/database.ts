export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Meeting {
  id: string;
  user_id: string;
  start_time: Date;
  end_time: Date;
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
