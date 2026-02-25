import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function POST(req: Request) {
  return withAuth(req, async (req, user: JWTPayload) => {
    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, type, referenceId, amount } = body;

    // Mock verification - in production, verify signature with Razorpay
    const isValid = true; // Mock: always valid

    if (!isValid) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Record payment
    const payment = await prisma.payment.create({
      data: {
        userId: user.userId,
        type: type === "breakdown" ? "BREAKDOWN" : "PART_ORDER",
        breakdownId: type === "breakdown" ? referenceId : null,
        orderId: type === "order" ? referenceId : null,
        amount,
        gstAmount: Math.round(amount * 0.18),
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        status: "PAID",
      },
    });

    // Update order/breakdown payment status
    if (type === "order" && referenceId) {
      await prisma.partOrder.update({
        where: { id: referenceId },
        data: { paymentStatus: "PAID" },
      });
    }

    return NextResponse.json({ success: true, payment });
  });
}
