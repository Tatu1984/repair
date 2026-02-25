import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { setEstimateSchema } from "@/lib/validations/breakdown";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = setEstimateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid estimate" }, { status: 400 });
    }

    const breakdown = await prisma.breakdownRequest.findFirst({
      where: { OR: [{ id }, { displayId: id }] },
      include: { mechanic: { select: { userId: true } } },
    });

    if (!breakdown) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Verify ownership: mechanic must be the one assigned, or user is ADMIN
    if (user.role !== "ADMIN" && breakdown.mechanic?.userId !== user.userId) {
      return NextResponse.json({ error: "Not authorized to update this breakdown" }, { status: 403 });
    }

    const updated = await prisma.breakdownRequest.update({
      where: { id: breakdown.id },
      data: {
        estimatedPrice: parsed.data.estimatedPrice,
        status: "ESTIMATE_SENT",
      },
    });

    return NextResponse.json({ breakdown: updated });
  }, ["MECHANIC", "ADMIN"]);
}
