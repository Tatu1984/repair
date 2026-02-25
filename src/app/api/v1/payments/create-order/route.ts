import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function POST(req: Request) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const body = await req.json();
    const { amount, type, referenceId } = body;

    if (!amount || !type) {
      return NextResponse.json({ error: "Amount and type required" }, { status: 400 });
    }

    // Mock Razorpay order creation
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    return NextResponse.json({
      orderId: mockOrderId,
      amount: amount * 100, // Razorpay uses paise
      currency: "INR",
      referenceId,
      // In production, create real Razorpay order here
    });
  });
}
