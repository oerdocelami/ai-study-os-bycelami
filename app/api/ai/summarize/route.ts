import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content } = await req.json();

  return NextResponse.json({
    summary: `🧠 Summary: ${content.slice(0, 80)}... (mocked)`
  });
}