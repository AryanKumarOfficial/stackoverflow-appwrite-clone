import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip middleware for static assets, API routes, and build files
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/favicon.ico" ||
    request.nextUrl.pathname.includes(".") ||
    request.nextUrl.pathname.startsWith("/__nextjs")
  ) {
    return NextResponse.next();
  }

  // For production, just pass through
  // Database setup will be handled in API routes and server components
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/images|favicon.ico).*)"],
};
