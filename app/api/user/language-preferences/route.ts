import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await prisma.userLanguagePreference.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      primaryLanguage: preferences?.primaryLanguage || null,
      secondaryLanguage: preferences?.secondaryLanguage || null,
    });
  } catch (error) {
    console.error("Error fetching language preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { primaryLanguage, secondaryLanguage } = await request.json();

    const preferences = await prisma.userLanguagePreference.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        primaryLanguage,
        secondaryLanguage,
      },
      create: {
        userId: session.user.id,
        primaryLanguage,
        secondaryLanguage,
      },
    });

    return NextResponse.json({
      primaryLanguage: preferences.primaryLanguage,
      secondaryLanguage: preferences.secondaryLanguage,
    });
  } catch (error) {
    console.error("Error saving language preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}
