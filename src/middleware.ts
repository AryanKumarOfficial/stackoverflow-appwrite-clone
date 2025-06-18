import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getOrCreateDb from "@/Models/server/dbSetup";
import getOrCreateStorage from "@/Models/server/storageSetup";

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

  // Only run database setup for actual page requests and in development
  if (process.env.NODE_ENV === "development") {
    // Run database setup asynchronously without blocking the request
    Promise.all([getOrCreateDb(), getOrCreateStorage()]).catch((error) => {
      console.error("Database/Storage setup error:", error);
    });
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
