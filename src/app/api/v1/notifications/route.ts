import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: user.userId },
        orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId: user.userId } }),
      prisma.notification.count({ where: { userId: user.userId, isRead: false } }),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}
