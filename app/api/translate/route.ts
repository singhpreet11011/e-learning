import { NextRequest, NextResponse } from "next/server";
import { translationService } from "@/lib/translation";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const translatedText = await translationService.translateText({
      text,
      targetLanguage,
      sourceLanguage: sourceLanguage || 'en',
    });

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
