import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { completeBreakdownSchema } from "@/lib/validations/breakdown";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = completeBreakdownSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const breakdown = await prisma.breakdownRequest.findFirst({
      where: { OR: [{ id }, { displayId: id }] },
    });

    if (!breakdown) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.breakdownRequest.update({
      where: { id: breakdown.id },
      data: {
        finalPrice: parsed.data.finalPrice,
        notes: parsed.data.notes,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Set mechanic back to ONLINE
    if (breakdown.mechanicId) {
      await prisma.mechanic.update({
        where: { id: breakdown.mechanicId },
        data: { status: "ONLINE", totalJobs: { increment: 1 }, completedToday: { increment: 1 } },
      });
    }

    return NextResponse.json({ breakdown: updated });
  }, ["MECHANIC"]);
}
