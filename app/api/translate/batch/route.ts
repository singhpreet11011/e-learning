import { NextRequest, NextResponse } from "next/server";
import { translationService } from "@/lib/translation";

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLanguage, sourceLanguage } = await request.json();

    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const translatedTexts = await translationService.translateBatch({
      texts,
      targetLanguage,
      sourceLanguage: sourceLanguage || 'en',
    });

    return NextResponse.json({ translatedTexts });
  } catch (error) {
    console.error("Batch translation API error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
