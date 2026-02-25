import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    const activeBreakdowns = await prisma.breakdownRequest.findMany({
      where: {
        status: {
          in: ["PENDING", "SEARCHING", "ACCEPTED", "EN_ROUTE", "ARRIVED", "DIAGNOSING", "IN_PROGRESS"],
        },
      },
      include: {
        rider: { select: { name: true, phone: true } },
        mechanic: {
          include: { user: { select: { name: true, phone: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ breakdowns: activeBreakdowns });
  }, ["ADMIN"]);
}
