import { NextResponse } from "next/server";
import { verifyAccessToken, getTokenFromRequest, type JWTPayload } from "./auth";

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
