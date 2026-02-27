import { NextResponse } from "next/server";
import { verifyAccessToken, getTokenFromRequest, type JWTPayload } from "./auth";
import { prisma } from "./db";

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function withAuth(
  req: Request,
  handler: (req: Request, user: JWTPayload) => Promise<NextResponse>,
  allowedRoles?: string[]
): Promise<NextResponse> {
  const token = getTokenFromRequest(req);

  if (!token) {
    return errorResponse("Authentication required", 401);
  }

  const payload = await verifyAccessToken(token);

  if (!payload) {
    return errorResponse("Invalid or expired token", 401);
  }

  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    return errorResponse("Insufficient permissions", 403);
  }

  return handler(req, payload);
}

/**
 * Find or auto-create a Workshop record for a WORKSHOP user.
 * Ensures workshop users always have a functioning portal.
 */
export async function getOrCreateWorkshop(userId: string) {
  let workshop = await prisma.workshop.findUnique({
    where: { ownerId: userId },
  });

  if (!workshop) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, phone: true },
    });
    workshop = await prisma.workshop.create({
      data: {
        ownerId: userId,
        name: user?.name || `Workshop ${user?.phone || ""}`,
        address: "",
      },
    });
  }

  return workshop;
}
