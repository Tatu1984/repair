import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const workshop = await prisma.workshop.findUnique({ where: { id } });
  if (!workshop) {
    return NextResponse.json({ error: "Workshop not found" }, { status: 404 });
  }

  const [parts, total] = await Promise.all([
    prisma.sparePart.findMany({
      where: { workshopId: id, isActive: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.sparePart.count({ where: { workshopId: id, isActive: true } }),
  ]);

  return NextResponse.json({
    workshop: { id: workshop.id, name: workshop.name },
    parts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
