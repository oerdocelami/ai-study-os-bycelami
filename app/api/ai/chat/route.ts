import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // MOCK AI RESPONSE
    const mockAnswer = `Based on your notes: "${question.substring(0, 30)}..." - This is a mock AI response. When you add OpenAI credits, this will provide real answers from your notes.`;

    return NextResponse.json({
      answer: mockAnswer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process chat" },
      { status: 500 }
    );
  }
}