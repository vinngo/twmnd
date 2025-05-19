import { createClient } from "@/lib/supabase/server";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = await createClient();
  const client = new OpenAI();

  try {
    const user_input = req.body.input;
    const transcript = req.body.transcript;
    const meeting_id = req.body.meeting_id;

    if (!meeting_id || !user_input || !transcript) {
      return res
        .status(400)
        .json({ error: "Meeting ID, input, and transcript are required" });
    }

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Answer questions from the user: ${user_input}, given the context: ${transcript}`,
    });

    const ai_output = response.output_text;

    const { data: insertedQuestion, error: insertQuestionError } =
      await supabase
        .from("questions")
        .insert({
          meeting_id,
          user_input,
          ai_response: ai_output,
        })
        .select()
        .single();

    if (insertQuestionError) {
      return res.status(500).json({ error: insertQuestionError.message });
    }

    res.status(200).json({ question: insertedQuestion });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
