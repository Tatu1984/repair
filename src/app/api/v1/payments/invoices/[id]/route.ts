import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, phone: true, email: true } },
        breakdown: { select: { displayId: true, emergencyType: true } },
        order: {
          select: { displayId: true, part: { select: { name: true } } },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const invoice = {
      paymentId: payment.id,
      date: payment.createdAt,
      customer: payment.user,
      type: payment.type,
      reference: payment.type === "BREAKDOWN" ? payment.breakdown : payment.order,
      subtotal: payment.amount - payment.gstAmount,
      gstAmount: payment.gstAmount,
      gstRate: 18,
      platformFee: payment.platformFee,
      total: payment.amount,
      status: payment.status,
      razorpayPaymentId: payment.razorpayPaymentId,
    };

    return NextResponse.json({ invoice });
  });
}
