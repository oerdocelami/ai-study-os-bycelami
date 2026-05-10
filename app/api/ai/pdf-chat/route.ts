import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    const { question, content } = await req.json();

    if (!question || !content) {
      return NextResponse.json(
        { error: "Question and PDF content required" },
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
            content: "You are a helpful study tutor. Answer questions ONLY based on the provided lecture content. If the answer is not in the content, say 'This topic is not covered in the lecture.'",
          },
          {
            role: "user",
            content: `Lecture content:\n\n${content.slice(0, 3000)}\n\nQuestion: ${question}`,
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

    const answer = data.choices[0].message.content;

    return NextResponse.json({ answer });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process PDF chat" },
      { status: 500 }
    );
  }
}