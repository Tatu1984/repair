import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { createPartSchema, searchPartsSchema } from "@/lib/validations/marketplace";
import type { JWTPayload } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

// GET - Search + filter + paginate parts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = searchPartsSchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const { search, vehicleType, brand, condition, minPrice, maxPrice, page, limit } = parsed.data;

  const where: Prisma.SparePartWhereInput = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { workshop: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (vehicleType && vehicleType !== "all") where.vehicleType = vehicleType;
  if (brand && brand !== "all") where.brand = brand;
  if (condition && condition !== "all") where.condition = condition as never;
  if (minPrice) where.price = { ...((where.price as object) || {}), gte: minPrice };
  if (maxPrice) where.price = { ...((where.price as object) || {}), lte: maxPrice };

  const [parts, total] = await Promise.all([
    prisma.sparePart.findMany({
      where,
      include: {
        workshop: {
          select: { name: true, address: true, rating: true, reviewCount: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.sparePart.count({ where }),
  ]);

  return NextResponse.json({
    parts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// POST - Create listing (Workshop)
export async function POST(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const body = await req.json();
    const parsed = createPartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const workshop = await prisma.workshop.findUnique({
      where: { ownerId: user.userId },
    });

    if (!workshop) {
      return NextResponse.json({ error: "Not a workshop owner" }, { status: 403 });
    }

    const part = await prisma.sparePart.create({
      data: {
        ...parsed.data,
        condition: parsed.data.condition as never,
        workshopId: workshop.id,
      },
    });

    return NextResponse.json({ part }, { status: 201 });
  }, ["WORKSHOP"]);
}
