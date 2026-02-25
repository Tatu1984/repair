import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import { updateOrderStatusSchema } from "@/lib/validations/order";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.partOrder.findFirst({
      where: { OR: [{ id }, { displayId: id }] },
    });

    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.partOrder.update({
      where: { id: order.id },
      data: { orderStatus: parsed.data.orderStatus },
    });

    return NextResponse.json({ order: updated });
  }, ["WORKSHOP", "ADMIN"]);
}
