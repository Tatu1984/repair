import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/auth";
import { refreshTokenSchema } from "@/lib/validations/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = refreshTokenSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }

    const { refreshToken } = parsed.data;

    // Verify JWT
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Check if token exists in DB
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: tokenHash },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token expired or revoked" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Rotate tokens: delete old, create new
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const newAccessToken = await signAccessToken(user.id, user.role);
    const newRefreshToken = await signRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: crypto.createHash("sha256").update(newRefreshToken).digest("hex"),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}
