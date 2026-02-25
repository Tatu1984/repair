import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { resolveDisputeSchema } from "@/lib/validations/dispute";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = resolveDisputeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const dispute = await prisma.dispute.findFirst({
      where: { OR: [{ id }, { displayId: id }] },
    });

    if (!dispute) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.dispute.update({
      where: { id: dispute.id },
      data: {
        resolution: parsed.data.resolution,
        status: parsed.data.status,
      },
    });

    return NextResponse.json({ dispute: updated });
  }, ["ADMIN"]);
}
