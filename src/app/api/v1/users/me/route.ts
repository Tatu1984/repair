import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(req, async (_req, user: JWTPayload) => {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        mechanic: true,
        workshop: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: dbUser });
  });
}

export async function PUT(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const body = await req.json();
    const { name, email } = body;

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      },
    });

    return NextResponse.json({ user: updated });
  });
}
