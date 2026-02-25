import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecret(envVar: string, fallback: string): Uint8Array {
  const secret = process.env[envVar];
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error(`${envVar} environment variable must be set in production`);
  }
  return new TextEncoder().encode(secret || fallback);
}

const JWT_SECRET = getSecret("JWT_SECRET", "repair-assist-jwt-secret-key-2024");

const publicPaths = ["/", "/login", "/api/v1/auth"];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths, static assets, and API routes not under auth
  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/v1/auth") ||
    /\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff2?|ttf|eot|map)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // For dashboard routes, check for auth token
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/breakdowns") ||
      pathname.startsWith("/mechanics") || pathname.startsWith("/workshops") ||
      pathname.startsWith("/marketplace") || pathname.startsWith("/orders") ||
      pathname.startsWith("/disputes") || pathname.startsWith("/analytics") ||
      pathname.startsWith("/settings")) {

    // Check cookie or Authorization header
    const token =
      request.cookies.get("access_token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      // Token invalid/expired — redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
