import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ entityType: string; entityId: string }> }
) {
  const { entityType, entityId } = await params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  let where: Record<string, unknown> = {};

  if (entityType === "user" || entityType === "mechanic" || entityType === "workshop") {
    where = { toUserId: entityId };
  } else if (entityType === "breakdown") {
    where = { breakdownId: entityId };
  } else if (entityType === "order") {
    where = { orderId: entityId };
  } else {
    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  }

  const [ratings, total] = await Promise.all([
    prisma.rating.findMany({
      where: where as never,
      include: {
        fromUser: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.rating.count({ where: where as never }),
  ]);

  const avg = await prisma.rating.aggregate({
    where: where as never,
    _avg: { stars: true },
  });

  return NextResponse.json({
    ratings,
    averageRating: avg._avg.stars || 0,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
