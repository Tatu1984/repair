import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    const workshops = await prisma.workshop.findMany({
      where: { verificationStatus: "PENDING" },
      include: {
        owner: { select: { name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ workshops });
  }, ["ADMIN"]);
}
