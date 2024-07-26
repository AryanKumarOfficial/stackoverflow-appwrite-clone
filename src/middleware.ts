import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import getOrCreateDb from "@/Models/server/dbSetup";
import getOrCreateStorage from "@/Models/server/storageSetup";

export async function middleware(request: NextRequest) {
    await Promise.all([
        getOrCreateDb(),
        getOrCreateStorage()
    ])
    return NextResponse.next();
}

export const config = {
    /* math all request paths except for the ones that start with:
    - api
    - _next/static
    - _next/images
    - favicon.ico
     */
    matcher: [
        "/((?!api|_next/static|_next/images|favicon.ico).*)",
    ]
}