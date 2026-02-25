import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const mechanic = await prisma.mechanic.findUnique({ where: { id } });
  if (!mechanic) {
    return NextResponse.json({ error: "Mechanic not found" }, { status: 404 });
  }

  const [ratings, total] = await Promise.all([
    prisma.rating.findMany({
      where: { toUserId: mechanic.userId },
      include: {
        fromUser: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.rating.count({ where: { toUserId: mechanic.userId } }),
  ]);

  return NextResponse.json({
    ratings,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
