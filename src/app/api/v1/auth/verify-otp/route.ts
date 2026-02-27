import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { verifyOtpSchema } from "@/lib/validations/auth";
import crypto from "crypto";

// Demo phones that use persistent OTPs (seeded with expiry 2030)
const DEMO_PHONES = new Set(["9999999999", "9811234567", "8765543211"]);

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
    const isDemo = DEMO_PHONES.has(phone) && otp === "123456";

    // Demo phones: skip DB OTP lookup entirely (OTPs may not be seeded)
    if (!isDemo) {
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

      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: { phone, role: role as "RIDER" | "MECHANIC" | "WORKSHOP" | "ADMIN" },
      });
    }

    // Auto-provision Workshop record for WORKSHOP users
    if (user.role === "WORKSHOP") {
      const existingWorkshop = await prisma.workshop.findUnique({
        where: { ownerId: user.id },
      });
      if (!existingWorkshop) {
        await prisma.workshop.create({
          data: {
            ownerId: user.id,
            name: user.name || `Workshop ${user.phone}`,
            address: "",
          },
        });
      }
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
