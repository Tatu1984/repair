import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (_req, user: JWTPayload) => {
    const { id } = await params;

    const mechanic = await prisma.mechanic.findUnique({
      where: { userId: user.userId },
    });

    if (!mechanic) {
      return NextResponse.json({ error: "Not a mechanic" }, { status: 403 });
    }

    const breakdown = await prisma.breakdownRequest.findFirst({
      where: { OR: [{ id }, { displayId: id }] },
    });

    if (!breakdown) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (breakdown.status !== "PENDING" && breakdown.status !== "SEARCHING") {
      return NextResponse.json({ error: "Cannot accept this breakdown" }, { status: 400 });
    }

    const updated = await prisma.breakdownRequest.update({
      where: { id: breakdown.id },
      data: {
        mechanicId: mechanic.id,
        status: "ACCEPTED",
      },
      include: {
        rider: { select: { name: true, phone: true } },
        mechanic: { include: { user: { select: { name: true } } } },
      },
    });

    // Update mechanic status to BUSY
    await prisma.mechanic.update({
      where: { id: mechanic.id },
      data: { status: "BUSY" },
    });

    return NextResponse.json({ breakdown: updated });
  }, ["MECHANIC"]);
}
