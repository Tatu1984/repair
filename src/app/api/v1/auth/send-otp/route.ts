import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOtpSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { phone, role } = parsed.data;

    // Mock OTP: always 123456
    const otp = "123456";
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this phone
    await prisma.otpVerification.deleteMany({
      where: { phone },
    });

    // Create new OTP record
    await prisma.otpVerification.create({
      data: { phone, otp, role, expiresAt },
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent to +91 ${phone}`,
      // In dev mode, return the OTP for convenience
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
