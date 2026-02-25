import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/middleware";
import type { JWTPayload } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, _user: JWTPayload) => {
    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    const statusMap: Record<string, "APPROVED" | "REJECTED" | "SUSPENDED"> = {
      approve: "APPROVED",
      reject: "REJECTED",
      suspend: "SUSPENDED",
    };

    const newStatus = statusMap[action];
    if (!newStatus) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const workshop = await prisma.workshop.update({
      where: { id },
      data: { verificationStatus: newStatus },
      include: { owner: { select: { name: true } } },
    });

    return NextResponse.json({ workshop });
  }, ["ADMIN"]);
}
