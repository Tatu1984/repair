import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";
import { updateWorkshopProfileSchema } from "@/lib/validations/workshop";

export async function GET(req: Request) {
  return withAuth(
    req,
    async (_req, user: JWTPayload) => {
      const workshop = await prisma.workshop.findUnique({
        where: { ownerId: user.userId },
        include: {
          owner: {
            select: { name: true, phone: true, email: true, avatarUrl: true },
          },
        },
      });

      if (!workshop) {
        return NextResponse.json(
          { error: "Workshop not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ workshop });
    },
    ["WORKSHOP"]
  );
}

export async function PUT(req: Request) {
  return withAuth(
    req,
    async (req, user: JWTPayload) => {
      const workshop = await prisma.workshop.findUnique({
        where: { ownerId: user.userId },
      });

      if (!workshop) {
        return NextResponse.json(
          { error: "Workshop not found" },
          { status: 404 }
        );
      }

      const body = await req.json();
      const parsed = updateWorkshopProfileSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validation failed", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const updated = await prisma.workshop.update({
        where: { id: workshop.id },
        data: parsed.data,
        include: {
          owner: {
            select: { name: true, phone: true, email: true, avatarUrl: true },
          },
        },
      });

      return NextResponse.json({ workshop: updated });
    },
    ["WORKSHOP"]
  );
}
