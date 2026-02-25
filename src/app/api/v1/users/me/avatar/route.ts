import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    try {
      const formData = await req.formData();
      const file = formData.get("avatar") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // For now, store as a data URL or placeholder
      // In production, use Vercel Blob
      const avatarUrl = `/avatars/${user.userId}.png`;

      const updated = await prisma.user.update({
        where: { id: user.userId },
        data: { avatarUrl },
      });

      return NextResponse.json({ user: updated });
    } catch (error) {
      console.error("Avatar upload error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  });
}
