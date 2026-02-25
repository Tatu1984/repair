import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { createRatingSchema } from "@/lib/validations/rating";
import type { JWTPayload } from "@/lib/auth";

export async function POST(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const body = await req.json();
    const parsed = createRatingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const rating = await prisma.rating.create({
      data: {
        fromUserId: user.userId,
        ...parsed.data,
      },
    });

    // Update mechanic/workshop average rating
    const avgResult = await prisma.rating.aggregate({
      where: { toUserId: parsed.data.toUserId },
      _avg: { stars: true },
      _count: true,
    });

    // Update mechanic rating if applicable
    const mechanic = await prisma.mechanic.findUnique({
      where: { userId: parsed.data.toUserId },
    });
    if (mechanic) {
      await prisma.mechanic.update({
        where: { id: mechanic.id },
        data: { rating: avgResult._avg.stars || 0 },
      });
    }

    // Update workshop rating if applicable
    const workshop = await prisma.workshop.findUnique({
      where: { ownerId: parsed.data.toUserId },
    });
    if (workshop) {
      await prisma.workshop.update({
        where: { id: workshop.id },
        data: {
          rating: avgResult._avg.stars || 0,
          reviewCount: avgResult._count,
        },
      });
    }

    return NextResponse.json({ rating }, { status: 201 });
  });
}
