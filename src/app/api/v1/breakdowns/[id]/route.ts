import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    const { id } = await params;

    const breakdown = await prisma.breakdownRequest.findFirst({
      where: { OR: [{ id }, { displayId: id }] },
      include: {
        rider: { select: { id: true, name: true, phone: true, avatarUrl: true } },
        mechanic: {
          include: { user: { select: { id: true, name: true, phone: true, avatarUrl: true } } },
        },
        chatMessages: {
          include: { sender: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!breakdown) {
      return NextResponse.json({ error: "Breakdown not found" }, { status: 404 });
    }

    return NextResponse.json({ breakdown });
  });
}
