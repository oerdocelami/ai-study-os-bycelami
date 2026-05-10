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
            content: "You are a helpful study assistant. Summarize the key points concisely.",
          },
          {
            role: "user",
            content: `Summarize this content in 3-5 bullet points:\n\n${content}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "OpenAI API error" },
        { status: response.status }
      );
    }

    const summary = data.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to summarize" },
      { status: 500 }
    );
  }
}