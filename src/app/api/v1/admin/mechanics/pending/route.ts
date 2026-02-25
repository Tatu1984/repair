import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // If status is provided, filter by it; otherwise return all mechanics
    if (status) {
      where.verificationStatus = status.toUpperCase();
    }

    // If search is provided, filter by name or phone
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } },
        ],
      };
    }

    const mechanics = await prisma.mechanic.findMany({
      where,
      include: {
        user: { select: { name: true, phone: true, email: true, createdAt: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ mechanics });
  }, ["ADMIN"]);
}
