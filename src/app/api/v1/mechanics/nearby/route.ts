import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getBoundingBox, haversineDistance } from "@/lib/geo";
import { nearbyMechanicsSchema } from "@/lib/validations/mechanic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = nearbyMechanicsSchema.safeParse({
    lat: searchParams.get("lat"),
    lng: searchParams.get("lng"),
    radius: searchParams.get("radius") || "15",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "lat and lng are required" },
      { status: 400 }
    );
  }

  const { lat, lng, radius } = parsed.data;
  const bounds = getBoundingBox(lat, lng, radius);

  // Pre-filter with bounding box, then apply Haversine
  const mechanics = await prisma.mechanic.findMany({
    where: {
      status: "ONLINE",
      verificationStatus: "APPROVED",
      latitude: { gte: bounds.minLat, lte: bounds.maxLat },
      longitude: { gte: bounds.minLng, lte: bounds.maxLng },
    },
    include: {
      user: { select: { id: true, name: true, phone: true, avatarUrl: true } },
    },
  });

  // Apply exact Haversine distance filter
  const nearbyMechanics = mechanics
    .map((m) => ({
      ...m,
      distance: haversineDistance(lat, lng, m.latitude!, m.longitude!),
    }))
    .filter((m) => m.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  return NextResponse.json({ mechanics: nearbyMechanics });
}
