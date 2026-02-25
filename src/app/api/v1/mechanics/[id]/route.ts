import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const mechanic = await prisma.mechanic.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, phone: true, avatarUrl: true, role: true } },
    },
  });

  if (!mechanic) {
    return NextResponse.json({ error: "Mechanic not found" }, { status: 404 });
  }

  return NextResponse.json({ mechanic });
}
