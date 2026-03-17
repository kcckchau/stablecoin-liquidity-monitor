/**
 * FRED Overview API Route
 * 
 * Returns latest RRP and TGA values with 7-day and 30-day changes
 * for dashboard display.
 */

import { NextResponse } from "next/server";
import { getFredOverview } from "@/lib/queries/fred";

export const dynamic = "force-dynamic";

/**
 * GET /api/fred/overview
 * 
 * Returns FRED macro liquidity indicators
 */
export async function GET() {
  try {
    const overview = await getFredOverview();

    return NextResponse.json({
      success: true,
      data: overview,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching FRED overview:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch FRED overview data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
