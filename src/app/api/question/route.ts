import { createClient } from "@/lib/supabase/server";
import { OpenAI } from "openai";
import { NextRequest } from "next/server";

export const runtime = "edge"; // enable edge runtime

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const body = await req.json();
    const user_input = body.input;
    const transcript = body.transcript;
    const meeting_id = body.meeting_id;

    if (!meeting_id || !user_input || !transcript) {
      return new Response(
        JSON.stringify({
          error: "Meeting ID, input, and transcript are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant answering questions based on a meeting transcript.",
        },
        {
          role: "user",
          content: `Answer this user query: "${user_input}"\n\nBased on this context:\n${transcript}`,
        },
      ],
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content || "";
          fullResponse += content;
          controller.enqueue(encoder.encode(content));
        }

        // Insert into Supabase once full response is complete
        const { error } = await supabase.from("questions").insert({
          meeting_id,
          user_input,
          ai_response: fullResponse,
        });

        if (error) {
          console.error("Supabase insert error:", error.message);
        }

        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
