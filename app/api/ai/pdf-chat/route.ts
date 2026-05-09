import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question, content } = await req.json();

    if (!question || !content) {
      return NextResponse.json(
        { error: "Question and PDF content required" },
        { status: 400 }
      );
    }

    // MOCK AI RESPONSE - grounded in PDF content
    const answer = `Based on your lecture PDF:\n\n"${content.slice(0, 200)}..."\n\nTo answer "${question}": This feature will provide real answers when connected to OpenAI.`;

    return NextResponse.json({
      answer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process PDF chat" },
      { status: 500 }
    );
  }
}