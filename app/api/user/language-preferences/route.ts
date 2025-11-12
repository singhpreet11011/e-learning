import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// ✅ Optional helper to check admin role
async function isAdmin() {
  const user = await currentUser();
  return user?.publicMetadata?.role === "admin";
}

// ===================== GET =====================
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔐 Optional: restrict GET to admins only
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const preferences = await prisma.userLanguagePreference.findUnique({
      where: { userId: user.id },
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

// ===================== POST =====================
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔐 Example: allow both normal users and admins
    // const admin = await isAdmin();
    // if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { primaryLanguage, secondaryLanguage } = await request.json();

    // Ensure user exists in database
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.emailAddresses[0]?.emailAddress,
        name: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : user.username,
        image: user.imageUrl,
      },
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : user.username,
        image: user.imageUrl,
      },
    });

    const preferences = await prisma.userLanguagePreference.upsert({
      where: { userId: user.id },
      update: { primaryLanguage, secondaryLanguage },
      create: { userId: user.id, primaryLanguage, secondaryLanguage },
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