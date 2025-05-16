import { createClient } from "../supabase/client";

export async function saveBlob(
  meeting_id: string,
  blob: Blob,
  chunk_index: number,
) {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      throw Error("User not found");
    }

    const timestamp = Date.now();

    const { error } = await supabase.storage
      .from("audio")
      .upload(
        `${user.id}/${meeting_id}/${timestamp}-chunk-${chunk_index}.webm`,
        blob,
        {
          cacheControl: "3600",
          upsert: false,
        },
      );

    if (error) {
      throw Error(error.message);
    }
  } catch (e) {
    console.error("could not save blob to audio", e);
    return { succes: false, error: e };
  }
}
