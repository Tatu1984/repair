import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await prisma.partOrder.findFirst({
    where: { OR: [{ id }, { displayId: id }] },
    include: {
      part: true,
      buyer: { select: { id: true, name: true, phone: true } },
      workshop: { select: { id: true, name: true, address: true, phone: true } },
      payments: true,
      ratings: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
