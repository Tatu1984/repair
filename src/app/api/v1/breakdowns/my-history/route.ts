import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get mechanic if applicable
    const mechanic = await prisma.mechanic.findUnique({
      where: { userId: user.userId },
    });

    const where = mechanic
      ? { OR: [{ riderId: user.userId }, { mechanicId: mechanic.id }] }
      : { riderId: user.userId };

    const [breakdowns, total] = await Promise.all([
      prisma.breakdownRequest.findMany({
        where: where as never,
        include: {
          rider: { select: { name: true, phone: true } },
          mechanic: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.breakdownRequest.count({ where: where as never }),
    ]);

    return NextResponse.json({
      breakdowns,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}
