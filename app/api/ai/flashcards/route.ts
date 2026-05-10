import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // MOCK AI - Generate flashcards from content
    // Later: Replace with actual OpenAI API
    const sentences = content.split(".").filter((s: string) => s.trim().length > 0);
    
    const flashcards = [];
    
    // Card 1: Main idea
    flashcards.push({
      question: "What is the main topic?",
      answer: content.slice(0, 100).trim() + "...",
    });

    // Card 2: Key details
    if (sentences.length > 1) {
      flashcards.push({
        question: "What are the key details?",
        answer: sentences.slice(0, 2).join(". ").trim(),
      });
    }

    // Card 3: Summary
    flashcards.push({
      question: "Summarize this in one sentence",
      answer: content.slice(0, 80).trim() + "...",
    });

    return NextResponse.json({ flashcards, count: flashcards.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}