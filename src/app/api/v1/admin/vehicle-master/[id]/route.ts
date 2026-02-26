import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";
import { updateVehicleMasterSchema } from "@/lib/validations/vehicle-master";

// PUT — Admin only, update entry
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateVehicleMasterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const entry = await prisma.vehicleMasterData.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ entry });
  }, ["ADMIN"]);
}

// DELETE — Admin only, soft delete (isActive=false)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    const { id } = await params;

    const entry = await prisma.vehicleMasterData.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ entry });
  }, ["ADMIN"]);
}
