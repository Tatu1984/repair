import { SignJWT, jwtVerify } from "jose";

function getSecret(envVar: string, fallback: string): Uint8Array {
  return new TextEncoder().encode(process.env[envVar] || fallback);
}

function jwtSecret() {
  return getSecret("JWT_SECRET", "repair-assist-jwt-secret-key-2024");
}

function jwtRefreshSecret() {
  return getSecret("JWT_REFRESH_SECRET", "repair-assist-refresh-secret-key-2024");
}

export interface JWTPayload {
  userId: string;
  role: string;
}

export async function signAccessToken(userId: string, role: string) {
  return new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(jwtSecret());
}

export async function signRefreshToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtRefreshSecret());
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, jwtRefreshSecret());
    return payload as unknown as { userId: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // Check cookie
  const cookies = req.headers.get("cookie");
  if (cookies) {
    const match = cookies.match(/access_token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}
