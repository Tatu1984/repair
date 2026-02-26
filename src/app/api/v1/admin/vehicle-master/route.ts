import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";
import { createVehicleMasterSchema } from "@/lib/validations/vehicle-master";

// GET — Public, returns all active entries grouped by vehicleType → brand → models
export async function GET() {
  try {
    const entries = await prisma.vehicleMasterData.findMany({
      where: { isActive: true },
      orderBy: [{ vehicleType: "asc" }, { brand: "asc" }, { model: "asc" }],
    });

    // Group: { vehicleType: { brand: [{ id, model, yearFrom, yearTo }] } }
    const grouped: Record<string, Record<string, Array<{
      id: string;
      model: string | null;
      yearFrom: number | null;
      yearTo: number | null;
    }>>> = {};

    for (const entry of entries) {
      if (!grouped[entry.vehicleType]) grouped[entry.vehicleType] = {};
      if (!grouped[entry.vehicleType][entry.brand]) grouped[entry.vehicleType][entry.brand] = [];
      grouped[entry.vehicleType][entry.brand].push({
        id: entry.id,
        model: entry.model,
        yearFrom: entry.yearFrom,
        yearTo: entry.yearTo,
      });
    }

    return NextResponse.json({ grouped, entries });
  } catch (error) {
    console.error("Vehicle master GET error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicle master data" }, { status: 500 });
  }
}

// POST — Admin only, add entry
export async function POST(req: Request) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const body = await req.json();
    const parsed = createVehicleMasterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const entry = await prisma.vehicleMasterData.create({
      data: parsed.data,
    });

    return NextResponse.json({ entry }, { status: 201 });
  }, ["ADMIN"]);
}
