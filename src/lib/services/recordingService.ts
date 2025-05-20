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

    //insert a pending transcript

    const { error: pendingTranscriptError } = await supabase
      .from("pending_transcripts")
      .insert({
        user_id: user.id,
        meeting_id,
        chunk_index,
        storage_path: `${user.id}/${meeting_id}/${timestamp}-chunk-${chunk_index}.webm`,
        status: "pending",
      });

    if (pendingTranscriptError) {
      throw Error(pendingTranscriptError.message);
    }
  } catch (e) {
    console.error("could not save blob to audio", e);
    return { succes: false, error: e };
  }
}

export async function invokeProcessing() {
  const supabase = createClient();

  try {
    const { error } = await supabase.functions.invoke(
      "process-pending-transcripts",
      {
        body: { name: "Functions" },
      },
    );

    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    console.error("could not invoke processing", e);
    return { succes: false, error: e };
  }
}
