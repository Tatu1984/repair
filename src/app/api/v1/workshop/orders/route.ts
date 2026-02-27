import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth, getOrCreateWorkshop } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";
import { workshopOrdersFilterSchema } from "@/lib/validations/workshop";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  return withAuth(
    req,
    async (req, user: JWTPayload) => {
      const workshop = await getOrCreateWorkshop(user.userId);

      const url = new URL(req.url);
      const params = Object.fromEntries(url.searchParams.entries());
      const parsed = workshopOrdersFilterSchema.safeParse(params);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid filters", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const { status, page, limit } = parsed.data;

      const where: Prisma.PartOrderWhereInput = {
        workshopId: workshop.id,
      };

      if (status) {
        where.orderStatus = status;
      }

      const [orders, total] = await Promise.all([
        prisma.partOrder.findMany({
          where,
          include: {
            part: {
              select: { name: true, brand: true, condition: true, images: true },
            },
            buyer: {
              select: { name: true, phone: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.partOrder.count({ where }),
      ]);

      return NextResponse.json({
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    },
    ["WORKSHOP"]
  );
}
