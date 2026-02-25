import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const dispute = await prisma.dispute.findFirst({
    where: { OR: [{ id }, { displayId: id }] },
    include: {
      raisedBy: { select: { id: true, name: true, role: true, phone: true } },
    },
  });

  if (!dispute) {
    return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
  }

  return NextResponse.json({ dispute });
}
