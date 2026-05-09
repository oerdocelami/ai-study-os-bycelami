import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // MOCK PDF extraction - real extraction enabled when pdfParse is available
    const bytes = await file.arrayBuffer();
    const text = `Mock extracted text from ${file.name}. Real PDF parsing will be enabled when dependencies are properly configured.`;

    return NextResponse.json({
      text: text,
      pages: 1,
    });
  } catch (error: any) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      { error: "Extraction failed: " + error.message },
      { status: 500 }
    );
  }
}