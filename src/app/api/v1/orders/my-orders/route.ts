import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [orders, total] = await Promise.all([
      prisma.partOrder.findMany({
        where: { buyerId: user.userId },
        include: {
          part: { select: { name: true } },
          workshop: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.partOrder.count({ where: { buyerId: user.userId } }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}
