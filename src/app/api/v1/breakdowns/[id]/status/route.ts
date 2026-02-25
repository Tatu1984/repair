import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { updateBreakdownStatusSchema } from "@/lib/validations/breakdown";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateBreakdownStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
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
        status: parsed.data.status,
        ...(parsed.data.status === "COMPLETED" && { completedAt: new Date() }),
      },
    });

    return NextResponse.json({ breakdown: updated });
  }, ["MECHANIC", "ADMIN"]);
}
