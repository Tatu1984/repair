import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth, getOrCreateWorkshop } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";
import { updateWorkshopProfileSchema } from "@/lib/validations/workshop";

export async function GET(req: Request) {
  return withAuth(
    req,
    async (_req, user: JWTPayload) => {
      const workshop = await getOrCreateWorkshop(user.userId);

      // Re-fetch with owner relation included
      const workshopWithOwner = await prisma.workshop.findUnique({
        where: { id: workshop.id },
        include: {
          owner: {
            select: { name: true, phone: true, email: true, avatarUrl: true },
          },
        },
      });

      return NextResponse.json({ workshop: workshopWithOwner });
    },
    ["WORKSHOP"]
  );
}

export async function PUT(req: Request) {
  return withAuth(
    req,
    async (req, user: JWTPayload) => {
      const workshop = await getOrCreateWorkshop(user.userId);

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
