import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { verifyOtpSchema } from "@/lib/validations/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { phone, otp, role } = parsed.data;

    // Verify OTP
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        phone,
        otp,
        verified: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: { phone, role: role as "RIDER" | "MECHANIC" | "WORKSHOP" | "ADMIN" },
      });
    }

    // Generate tokens
    const accessToken = await signAccessToken(user.id, user.role);
    const refreshTokenValue = await signRefreshToken(user.id);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: crypto.createHash("sha256").update(refreshTokenValue).digest("hex"),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
      refreshToken: refreshTokenValue,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
