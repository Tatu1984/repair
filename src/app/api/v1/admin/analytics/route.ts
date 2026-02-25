import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "this-month";

    const now = new Date();

    // Determine date range based on query parameter
    let rangeStartDate: Date;
    switch (range) {
      case "this-week": {
        rangeStartDate = new Date(now);
        rangeStartDate.setDate(rangeStartDate.getDate() - 7);
        break;
      }
      case "3-months": {
        rangeStartDate = new Date(now);
        rangeStartDate.setMonth(rangeStartDate.getMonth() - 3);
        break;
      }
      case "this-month":
      default: {
        rangeStartDate = new Date(now);
        rangeStartDate.setDate(rangeStartDate.getDate() - 30);
        break;
      }
    }

    const thirtyDaysAgo = rangeStartDate;
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalBreakdowns,
      totalMechanics,
      totalParts,
      totalPartsSold,
      totalRevenueResult,
      avgRatingResult,
      breakdownsByType,
      breakdownsByStatus,
      recentBreakdowns,
      revenueByMonth,
      topMechanics,
      cityBreakdowns,
      topParts,
    ] = await Promise.all([
      // Total breakdowns
      prisma.breakdownRequest.count(),

      // Active mechanics
      prisma.mechanic.count({ where: { verificationStatus: "APPROVED" } }),

      // Total active parts
      prisma.sparePart.count({ where: { isActive: true } }),

      // Parts sold (orders delivered)
      prisma.partOrder.count({ where: { orderStatus: "DELIVERED" } }),

      // Total revenue
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),

      // Average rating
      prisma.rating.aggregate({
        _avg: { stars: true },
      }),

      // Breakdowns by emergency type
      prisma.breakdownRequest.groupBy({
        by: ["emergencyType"],
        _count: { id: true },
      }),

      // Breakdowns by status
      prisma.breakdownRequest.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      // Breakdowns over last 30 days
      prisma.breakdownRequest.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, status: true },
        orderBy: { createdAt: "asc" },
      }),

      // Revenue by month (last 6 months)
      prisma.payment.findMany({
        where: {
          status: "PAID",
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
          },
        },
        select: { amount: true, type: true, createdAt: true },
      }),

      // Top mechanics by rating
      prisma.mechanic.findMany({
        take: 10,
        where: { verificationStatus: "APPROVED" },
        orderBy: { rating: "desc" },
        include: { user: { select: { name: true } } },
      }),

      // Breakdowns by location (city from address)
      prisma.breakdownRequest.findMany({
        select: { locationAddress: true },
        where: { locationAddress: { not: null } },
      }),

      // Top ordered parts
      prisma.partOrder.groupBy({
        by: ["partId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 6,
      }),
    ]);

    // Process breakdown trends (group by day)
    const breakdownTrends = groupByDay(recentBreakdowns);

    // Process breakdown types for pie chart
    const typeColors: Record<string, string> = {
      PUNCTURE: "#4f46e5",
      FLAT_TYRE: "#4f46e5",
      ENGINE_STALL: "#ef4444",
      BATTERY_DEAD: "#8b5cf6",
      CHAIN_BREAK: "#f59e0b",
      FUEL_EMPTY: "#06b6d4",
      BRAKE_FAILURE: "#ef4444",
      CLUTCH_ISSUE: "#f59e0b",
      SELF_START_FAIL: "#6366f1",
      OVERHEATING: "#ef4444",
      OTHER: "#6b7280",
    };

    const breakdownTypes = breakdownsByType.map((bt) => ({
      name: formatEnumLabel(bt.emergencyType),
      value: bt._count.id,
      color: typeColors[bt.emergencyType] || "#6b7280",
    }));

    // Process revenue by month
    const revenueGrouped = groupRevenueByMonth(revenueByMonth);

    // Process city breakdown data
    const cityData = processCityData(cityBreakdowns);

    // Fetch part names for top parts
    const topPartsWithNames = await getTopPartsWithNames(topParts);

    // Calculate avg response time (mock for now since we don't track this)
    const avgResponseTime = "12 min";

    return NextResponse.json({
      stats: {
        totalBreakdowns,
        avgResponseTime,
        totalRevenue: totalRevenueResult._sum.amount || 0,
        activeMechanics: totalMechanics,
        partsSold: totalPartsSold,
        customerSatisfaction: avgRatingResult._avg.stars
          ? `${avgRatingResult._avg.stars.toFixed(1)} / 5.0`
          : "N/A",
      },
      breakdownTrends,
      breakdownTypes,
      revenueByMonth: revenueGrouped,
      mechanicPerformance: topMechanics.map((m) => ({
        name: m.user.name,
        rating: m.rating,
        totalJobs: m.totalJobs,
      })),
      cityBreakdowns: cityData,
      topParts: topPartsWithNames,
    });
  }, ["ADMIN"]);
}

// --- Helpers ---

function formatEnumLabel(val: string): string {
  return val
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function groupByDay(
  breakdowns: { createdAt: Date; status: string }[]
): { date: string; breakdowns: number; resolved: number }[] {
  const map = new Map<string, { breakdowns: number; resolved: number }>();

  for (const bd of breakdowns) {
    const day = bd.createdAt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
    const entry = map.get(day) || { breakdowns: 0, resolved: 0 };
    entry.breakdowns++;
    if (bd.status === "COMPLETED") entry.resolved++;
    map.set(day, entry);
  }

  return Array.from(map.entries()).map(([date, counts]) => ({
    date,
    ...counts,
  }));
}

function groupRevenueByMonth(
  payments: { amount: number; type: string; createdAt: Date }[]
): { month: string; services: number; parts: number }[] {
  const map = new Map<string, { services: number; parts: number }>();

  for (const p of payments) {
    const month = p.createdAt.toLocaleDateString("en-IN", { month: "short" });
    const entry = map.get(month) || { services: 0, parts: 0 };
    if (p.type === "BREAKDOWN") {
      entry.services += p.amount;
    } else {
      entry.parts += p.amount;
    }
    map.set(month, entry);
  }

  return Array.from(map.entries()).map(([month, amounts]) => ({
    month,
    ...amounts,
  }));
}

function processCityData(
  breakdowns: { locationAddress: string | null }[]
): { city: string; count: number; percentage: number }[] {
  const cityMap = new Map<string, number>();

  for (const bd of breakdowns) {
    if (!bd.locationAddress) continue;
    // Extract city from address (take last meaningful part)
    const parts = bd.locationAddress.split(",").map((p) => p.trim());
    const city = parts[parts.length - 1] || parts[0] || "Unknown";
    cityMap.set(city, (cityMap.get(city) || 0) + 1);
  }

  const total = breakdowns.length || 1;
  return Array.from(cityMap.entries())
    .map(([city, count]) => ({
      city,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

async function getTopPartsWithNames(
  topParts: { partId: string; _count: { id: number } }[]
): Promise<{ name: string; demand: number; trend: number }[]> {
  if (topParts.length === 0) return [];

  const parts = await prisma.sparePart.findMany({
    where: { id: { in: topParts.map((p) => p.partId) } },
    select: { id: true, name: true },
  });

  const nameMap = new Map(parts.map((p) => [p.id, p.name]));

  return topParts.map((tp) => ({
    name: nameMap.get(tp.partId) || "Unknown Part",
    demand: tp._count.id,
    trend: 0, // No historical comparison available yet
  }));
}
