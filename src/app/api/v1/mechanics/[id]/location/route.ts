import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { updateMechanicLocationSchema } from "@/lib/validations/mechanic";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateMechanicLocationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const mechanic = await prisma.mechanic.findUnique({ where: { id } });
    if (!mechanic || mechanic.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.mechanic.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ mechanic: updated });
  }, ["MECHANIC"]);
}
