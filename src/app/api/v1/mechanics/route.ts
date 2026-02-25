import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { registerMechanicSchema } from "@/lib/validations/mechanic";
import type { JWTPayload } from "@/lib/auth";

export async function POST(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const body = await req.json();
    const parsed = registerMechanicSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Check if already registered
    const existing = await prisma.mechanic.findUnique({
      where: { userId: user.userId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already registered as mechanic" },
        { status: 409 }
      );
    }

    const mechanic = await prisma.mechanic.create({
      data: {
        userId: user.userId,
        ...parsed.data,
      },
    });

    // Update user role
    await prisma.user.update({
      where: { id: user.userId },
      data: { role: "MECHANIC" },
    });

    return NextResponse.json({ mechanic }, { status: 201 });
  });
}
