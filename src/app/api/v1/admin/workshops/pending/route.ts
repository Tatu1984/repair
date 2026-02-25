import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const;

export async function GET(req: Request) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status")?.toUpperCase();

    const where =
      status && VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])
        ? { verificationStatus: status as (typeof VALID_STATUSES)[number] }
        : {};

    const workshops = await prisma.workshop.findMany({
      where,
      include: {
        owner: { select: { name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ workshops });
  }, ["ADMIN"]);
}
