import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const body = await req.json();
    const user_input = body.input;
    const transcript = body.transcript;
    const meeting_id = body.meeting_id;

    if (!meeting_id || !user_input || !transcript) {
      return NextResponse.json(
        { error: "Meeting ID, input, and transcript are required" },
        { status: 400 },
      );
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
      return NextResponse.json(
        { error: insertQuestionError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ question: insertedQuestion }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
