import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth, getOrCreateWorkshop } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";
import { workshopInventoryFilterSchema } from "@/lib/validations/workshop";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  return withAuth(
    req,
    async (req, user: JWTPayload) => {
      const workshop = await getOrCreateWorkshop(user.userId);

      const url = new URL(req.url);
      const params = Object.fromEntries(url.searchParams.entries());
      const parsed = workshopInventoryFilterSchema.safeParse(params);

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid filters", details: parsed.error.flatten() },
          { status: 400 }
        );
      }

      const { search, condition, stockStatus, category, page, limit } =
        parsed.data;

      const where: Prisma.SparePartWhereInput = {
        workshopId: workshop.id,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { serialNumber: { contains: search, mode: "insensitive" } },
        ];
      }

      if (condition) {
        where.condition = condition;
      }

      if (category) {
        where.category = category;
      }

      if (stockStatus === "out_of_stock") {
        where.stock = 0;
      } else if (stockStatus === "low_stock") {
        where.stock = { gt: 0, lt: 5 };
      } else if (stockStatus === "in_stock") {
        where.stock = { gte: 5 };
      }

      const [parts, total] = await Promise.all([
        prisma.sparePart.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.sparePart.count({ where }),
      ]);

      return NextResponse.json({
        parts,
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
