import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(req: Request) {
  return withAuth(
    req,
    async (_req, user: JWTPayload) => {
      const workshop = await prisma.workshop.findUnique({
        where: { ownerId: user.userId },
      });

      if (!workshop) {
        return NextResponse.json(
          { error: "Workshop not found" },
          { status: 404 }
        );
      }

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        totalParts,
        activeParts,
        totalStockAgg,
        lowStockCount,
        totalOrders,
        pendingOrders,
        monthlyOrders,
        revenueAgg,
        monthlyRevenueAgg,
        recentOrders,
        topSellingParts,
        inventoryByCondition,
      ] = await Promise.all([
        // Total parts listed
        prisma.sparePart.count({ where: { workshopId: workshop.id } }),
        // Active parts
        prisma.sparePart.count({
          where: { workshopId: workshop.id, isActive: true },
        }),
        // Total stock
        prisma.sparePart.aggregate({
          where: { workshopId: workshop.id },
          _sum: { stock: true },
        }),
        // Low stock count (stock < 5 and active)
        prisma.sparePart.count({
          where: { workshopId: workshop.id, isActive: true, stock: { lt: 5 } },
        }),
        // Total orders received
        prisma.partOrder.count({ where: { workshopId: workshop.id } }),
        // Pending orders
        prisma.partOrder.count({
          where: { workshopId: workshop.id, orderStatus: "PENDING" },
        }),
        // Orders this month
        prisma.partOrder.count({
          where: {
            workshopId: workshop.id,
            createdAt: { gte: startOfMonth },
          },
        }),
        // Total revenue (delivered orders)
        prisma.partOrder.aggregate({
          where: {
            workshopId: workshop.id,
            orderStatus: "DELIVERED",
          },
          _sum: { totalAmount: true },
        }),
        // Revenue this month
        prisma.partOrder.aggregate({
          where: {
            workshopId: workshop.id,
            orderStatus: "DELIVERED",
            createdAt: { gte: startOfMonth },
          },
          _sum: { totalAmount: true },
        }),
        // Recent orders (last 5)
        prisma.partOrder.findMany({
          where: { workshopId: workshop.id },
          include: {
            part: { select: { name: true, brand: true } },
            buyer: { select: { name: true, phone: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        // Top selling parts (by order count)
        prisma.partOrder.groupBy({
          by: ["partId"],
          where: { workshopId: workshop.id },
          _count: { id: true },
          _sum: { totalAmount: true },
          orderBy: { _count: { id: "desc" } },
          take: 5,
        }),
        // Inventory grouped by condition
        prisma.sparePart.groupBy({
          by: ["condition"],
          where: { workshopId: workshop.id, isActive: true },
          _count: { id: true },
          _sum: { stock: true },
        }),
      ]);

      // Enrich top selling parts with names
      const topPartIds = topSellingParts.map((p) => p.partId);
      const topPartDetails = await prisma.sparePart.findMany({
        where: { id: { in: topPartIds } },
        select: { id: true, name: true, brand: true },
      });
      const partMap = new Map(topPartDetails.map((p) => [p.id, p]));

      const enrichedTopParts = topSellingParts.map((p) => ({
        partId: p.partId,
        name: partMap.get(p.partId)?.name ?? "Unknown",
        brand: partMap.get(p.partId)?.brand ?? "",
        orderCount: p._count.id,
        revenue: p._sum.totalAmount ?? 0,
      }));

      // Low stock parts for alerts
      const lowStockParts = await prisma.sparePart.findMany({
        where: { workshopId: workshop.id, isActive: true, stock: { lt: 5 } },
        select: { id: true, name: true, brand: true, stock: true },
        orderBy: { stock: "asc" },
        take: 10,
      });

      return NextResponse.json({
        stats: {
          totalParts,
          activeParts,
          totalStock: totalStockAgg._sum.stock ?? 0,
          lowStockCount,
          totalOrders,
          pendingOrders,
          monthlyOrders,
          totalRevenue: revenueAgg._sum.totalAmount ?? 0,
          monthlyRevenue: monthlyRevenueAgg._sum.totalAmount ?? 0,
        },
        recentOrders,
        topSellingParts: enrichedTopParts,
        lowStockParts,
        inventoryByCondition: inventoryByCondition.map((g) => ({
          condition: g.condition,
          count: g._count.id,
          totalStock: g._sum.stock ?? 0,
        })),
      });
    },
    ["WORKSHOP"]
  );
}
