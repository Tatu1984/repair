import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      activeBreakdowns,
      onlineMechanics,
      totalMechanics,
      totalWorkshops,
      totalOrders,
      totalParts,
      pendingBreakdowns,
      completedToday,
      recentBreakdowns,
      topMechanics,
      totalRevenue,
    ] = await Promise.all([
      prisma.breakdownRequest.count({
        where: { status: { in: ["PENDING", "SEARCHING", "ACCEPTED", "EN_ROUTE", "ARRIVED", "DIAGNOSING", "IN_PROGRESS"] } },
      }),
      prisma.mechanic.count({ where: { status: "ONLINE" } }),
      prisma.mechanic.count(),
      prisma.workshop.count(),
      prisma.partOrder.count(),
      prisma.sparePart.count({ where: { isActive: true } }),
      prisma.breakdownRequest.count({ where: { status: "PENDING" } }),
      prisma.breakdownRequest.count({
        where: { status: "COMPLETED", completedAt: { gte: today } },
      }),
      prisma.breakdownRequest.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          rider: { select: { name: true } },
          mechanic: { include: { user: { select: { name: true } } } },
        },
      }),
      prisma.mechanic.findMany({
        take: 5,
        where: { verificationStatus: "APPROVED" },
        orderBy: { rating: "desc" },
        include: { user: { select: { name: true, avatarUrl: true } } },
      }),
      prisma.payment.aggregate({
        where: { status: "PAID", createdAt: { gte: today } },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        activeBreakdowns,
        onlineMechanics,
        totalMechanics,
        totalWorkshops,
        totalOrders,
        totalParts,
        pendingBreakdowns,
        completedToday,
        revenueToday: totalRevenue._sum.amount || 0,
      },
      recentBreakdowns,
      topMechanics,
    });
  }, ["ADMIN"]);
}
