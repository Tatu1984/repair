import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(req: Request) {
  return withAuth(req, async (_req, user: JWTPayload) => {
    await prisma.notification.updateMany({
      where: { userId: user.userId, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  });
}
