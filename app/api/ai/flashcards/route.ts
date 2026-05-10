import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a study assistant. Create flashcards in JSON format. Return ONLY valid JSON with no markdown. Format: {\"flashcards\": [{\"question\": \"...\", \"answer\": \"...\"}]}",
          },
          {
            role: "user",
            content: `Create 5 flashcards from this content:\n\n${content.slice(0, 2000)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "OpenAI API error" },
        { status: response.status }
      );
    }

    const content_text = data.choices[0].message.content;
    const parsed = JSON.parse(content_text);
    const flashcards = parsed.flashcards || [];

    return NextResponse.json({
      flashcards,
      count: flashcards.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}