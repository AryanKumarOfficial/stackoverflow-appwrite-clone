import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const performanceMetric = await request.json();

    // In production, you would send this to your monitoring service
    console.log("Performance Metric:", {
      timestamp: new Date().toISOString(),
      ...performanceMetric,
    });

    // You could store this in:
    // - InfluxDB for time-series data
    // - Grafana for visualization
    // - New Relic for APM
    // - Custom analytics service

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to process performance metric:", error);
    return NextResponse.json(
      { error: "Failed to process performance metric" },
      { status: 500 },
    );
  }
}
