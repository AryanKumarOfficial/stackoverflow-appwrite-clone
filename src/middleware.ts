import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getOrCreateDb from "@/Models/server/dbSetup";
import getOrCreateStorage from "@/Models/server/storageSetup";

export async function middleware(request: NextRequest) {
  // Only run database setup for actual page requests, not during build/startup
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  try {
    await Promise.all([getOrCreateDb(), getOrCreateStorage()]);
  } catch (error) {
    console.error("Middleware error:", error);
    // Don't block the request even if setup fails
  }

  return NextResponse.next();
}

export const config = {
  /* math all request paths except for the ones that start with:
    - api
    - _next/static
    - _next/images
    - favicon.ico
     */
  matcher: ["/((?!api|_next/static|_next/images|favicon.ico).*)"],
};
