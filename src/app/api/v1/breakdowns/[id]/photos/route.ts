import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { id } = await params;

    const breakdown = await prisma.breakdownRequest.findFirst({
      where: { OR: [{ id }, { displayId: id }] },
    });

    if (!breakdown) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Accept JSON with photo URLs for now
    const body = await req.json();
    const { photoUrls } = body;

    if (!Array.isArray(photoUrls)) {
      return NextResponse.json({ error: "photoUrls must be an array" }, { status: 400 });
    }

    const existingPhotos = (breakdown.photos as string[]) || [];
    const updated = await prisma.breakdownRequest.update({
      where: { id: breakdown.id },
      data: { photos: [...existingPhotos, ...photoUrls] },
    });

    return NextResponse.json({ breakdown: updated });
  }, ["MECHANIC"]);
}
