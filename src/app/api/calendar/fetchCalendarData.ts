import axios from "axios";

export const refreshAccessToken = async (refreshToken: string) => {
  const res = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return res.data;
};

export const getCalendarEvents = async (accessToken: string) => {
  try {
    // Use accessToken to prevent unused variable error
    const res = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        params: {
          timeMin: new Date().toISOString(),
          singleEvents: true,
          orderBy: "startTime",
          maxResults: 10,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return res.data.items;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("access_token_expired");
    }
    throw error;
  }
};
