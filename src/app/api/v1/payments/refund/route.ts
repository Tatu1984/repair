import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function POST(req: Request) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const body = await req.json();
    const { paymentId, reason } = body;

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId required" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Mock refund - in production, call Razorpay refund API
    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "REFUNDED" },
    });

    return NextResponse.json({
      success: true,
      message: "Refund initiated",
      payment: updated,
      reason,
    });
  }, ["ADMIN"]);
}
