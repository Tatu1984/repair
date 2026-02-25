import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";
import { z } from "zod";

const platformConfigSchema = z.object({
  platformName: z.string().min(1).max(100).optional(),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().min(1).max(20).optional(),
  defaultLanguage: z.string().min(2).max(5).optional(),
  defaultCurrency: z.string().min(3).max(3).optional(),
  serviceCommission: z.number().min(0).max(100).optional(),
  partsCommission: z.number().min(0).max(100).optional(),
  lateNightSurcharge: z.number().min(0).max(100).optional(),
  lateNightEnabled: z.boolean().optional(),
  emergencySurcharge: z.number().min(0).max(100).optional(),
  emergencyEnabled: z.boolean().optional(),
  minimumServiceFee: z.number().min(0).optional(),
  mechanicRadiusKm: z.number().min(1).max(100).optional(),
  autoApproveMechanics: z.boolean().optional(),
  requireAadhaar: z.boolean().optional(),
  requirePAN: z.boolean().optional(),
  requireTradeLicense: z.boolean().optional(),
  requirePhotoID: z.boolean().optional(),
  kycProvider: z.string().min(1).max(50).optional(),
}).strict();

// GET - Get platform config
export async function GET(req: Request) {
  return withAuth(req, async (_req, _user: JWTPayload) => {
    let config = await prisma.platformConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config) {
      config = await prisma.platformConfig.create({
        data: { id: "singleton" },
      });
    }

    return NextResponse.json({ config });
  }, ["ADMIN"]);
}

// PUT - Update platform config
export async function PUT(req: Request) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const body = await req.json();
    const parsed = platformConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const config = await prisma.platformConfig.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...parsed.data },
      update: parsed.data,
    });

    return NextResponse.json({ config });
  }, ["ADMIN"]);
}
