import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { createOrderSchema } from "@/lib/validations/order";
import type { JWTPayload } from "@/lib/auth";

// POST - Place order
export async function POST(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const part = await prisma.sparePart.findUnique({
      where: { id: parsed.data.partId },
      include: { workshop: true },
    });

    if (!part || !part.isActive) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }

    if (part.stock < parsed.data.quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    const subtotal = part.price * parsed.data.quantity;
    const gstAmount = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + gstAmount;

    const displayId = `ORD-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    const order = await prisma.partOrder.create({
      data: {
        displayId,
        partId: part.id,
        buyerId: user.userId,
        workshopId: part.workshopId,
        quantity: parsed.data.quantity,
        unitPrice: part.price,
        subtotal,
        gstAmount,
        totalAmount,
        shippingAddress: parsed.data.shippingAddress,
      },
      include: {
        part: true,
        workshop: { select: { name: true, address: true } },
      },
    });

    // Reduce stock
    await prisma.sparePart.update({
      where: { id: part.id },
      data: { stock: { decrement: parsed.data.quantity } },
    });

    return NextResponse.json({ order }, { status: 201 });
  }, ["RIDER", "MECHANIC"]);
}

// GET - List all orders (Admin)
export async function GET(req: Request) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.orderStatus = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      prisma.partOrder.findMany({
        where: where as never,
        include: {
          part: { select: { name: true } },
          buyer: { select: { name: true, phone: true } },
          workshop: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.partOrder.count({ where: where as never }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }, ["ADMIN"]);
}
