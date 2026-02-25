import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { createDisputeSchema } from "@/lib/validations/dispute";
import type { JWTPayload } from "@/lib/auth";

// POST - Raise dispute
export async function POST(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const body = await req.json();
    const parsed = createDisputeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const displayId = `DSP-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    const dispute = await prisma.dispute.create({
      data: {
        ...parsed.data,
        priority: parsed.data.priority as never,
        displayId,
        raisedById: user.userId,
      },
      include: {
        raisedBy: { select: { name: true, role: true } },
      },
    });

    return NextResponse.json({ dispute }, { status: 201 });
  });
}

// GET - List all disputes (Admin)
export async function GET(req: Request) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status.toUpperCase().replace(" ", "_");
    }

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where: where as never,
        include: {
          raisedBy: { select: { name: true, role: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dispute.count({ where: where as never }),
    ]);

    return NextResponse.json({
      disputes,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }, ["ADMIN"]);
}
