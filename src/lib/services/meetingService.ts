import { createClient } from "../supabase/client";

export async function createMeeting() {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user || userError) {
      throw new Error("User not found");
    }
    const { data, error } = await supabase
      .from("meetings")
      .insert({
        user_id: user.id,
        start_time: new Date(),
        date: new Date(),
        title: "Untitled",
      })
      .select()
      .single();

    if (error) throw error;
    return { succes: true, data };
  } catch (e) {
    console.error("could not create a meeting!", e);
    return { succes: false, error: e };
  }
}

export async function endMeeting(meeting_id: string | null) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("meetings")
      .update({ end_time: new Date() })
      .eq("id", meeting_id)
      .select()
      .single();

    if (error) throw error;
    return { succes: true, data };
  } catch (e) {
    console.error("could not end the meeting!", e);
    return { succes: false, error: e };
  }
}
