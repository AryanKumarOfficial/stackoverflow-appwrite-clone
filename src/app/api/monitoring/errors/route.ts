import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const errorReport = await request.json();

    // In production, you would send this to your monitoring service
    // For now, we'll just log it
    console.error("Error Report:", {
      timestamp: new Date().toISOString(),
      ...errorReport,
    });

    // You could also store in a database or send to services like:
    // - Sentry
    // - LogRocket
    // - Bugsnag
    // - Custom logging service

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to process error report:", error);
    return NextResponse.json(
      { error: "Failed to process error report" },
      { status: 500 },
    );
  }
}
