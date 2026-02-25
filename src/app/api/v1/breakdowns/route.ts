import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { createBreakdownSchema } from "@/lib/validations/breakdown";
import type { JWTPayload } from "@/lib/auth";

// POST - Create breakdown request (Rider)
export async function POST(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const body = await req.json();
    const parsed = createBreakdownSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Generate display ID
    const count = await prisma.breakdownRequest.count();
    const displayId = `BR-${String(count + 2401).padStart(4, "0")}`;

    const breakdown = await prisma.breakdownRequest.create({
      data: {
        ...parsed.data,
        displayId,
        riderId: user.userId,
        emergencyType: parsed.data.emergencyType as never,
      },
      include: {
        rider: { select: { name: true, phone: true } },
      },
    });

    return NextResponse.json({ breakdown }, { status: 201 });
  }, ["RIDER"]);
}

// GET - List all breakdowns (Admin) with filters
export async function GET(req: Request) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }
    if (search) {
      where.OR = [
        { displayId: { contains: search, mode: "insensitive" } },
        { rider: { name: { contains: search, mode: "insensitive" } } },
        { locationAddress: { contains: search, mode: "insensitive" } },
      ];
    }

    const [breakdowns, total] = await Promise.all([
      prisma.breakdownRequest.findMany({
        where: where as never,
        include: {
          rider: { select: { name: true, phone: true } },
          mechanic: {
            include: { user: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.breakdownRequest.count({ where: where as never }),
    ]);

    return NextResponse.json({
      breakdowns,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });
}
