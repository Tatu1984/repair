import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { updatePartSchema } from "@/lib/validations/marketplace";
import type { JWTPayload } from "@/lib/auth";

// GET - Part details
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const part = await prisma.sparePart.findUnique({
    where: { id },
    include: {
      workshop: {
        select: { id: true, name: true, address: true, rating: true, reviewCount: true, phone: true },
      },
    },
  });

  if (!part) {
    return NextResponse.json({ error: "Part not found" }, { status: 404 });
  }

  return NextResponse.json({ part });
}

// PUT - Update listing
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = updatePartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const part = await prisma.sparePart.findUnique({
      where: { id },
      include: { workshop: true },
    });

    if (!part || part.workshop.ownerId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.sparePart.update({
      where: { id },
      data: parsed.data as never,
    });

    return NextResponse.json({ part: updated });
  }, ["WORKSHOP"]);
}

// DELETE - Delete listing
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (_req, user: JWTPayload) => {
    const { id } = await params;

    const part = await prisma.sparePart.findUnique({
      where: { id },
      include: { workshop: true },
    });

    if (!part) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && part.workshop.ownerId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.sparePart.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  }, ["WORKSHOP", "ADMIN"]);
}
