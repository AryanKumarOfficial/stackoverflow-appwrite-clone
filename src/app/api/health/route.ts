import { NextRequest, NextResponse } from "next/server";
import { databases } from "@/Models/server/config";
import { db } from "@/Models/name";

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check database connectivity
    await databases.get(db);

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      responseTime: `${responseTime}ms`,
      checks: {
        database: "connected",
        server: "running",
      },
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV,
        responseTime: `${responseTime}ms`,
        checks: {
          database: "disconnected",
          server: "running",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
