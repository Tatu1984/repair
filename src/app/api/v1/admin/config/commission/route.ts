import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

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

    const config = await prisma.platformConfig.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...body },
      update: body,
    });

    return NextResponse.json({ config });
  }, ["ADMIN"]);
}
