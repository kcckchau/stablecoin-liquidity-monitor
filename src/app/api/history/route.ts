import { NextResponse } from "next/server";
import { getStablecoinHistory } from "@/lib/queries/history";

/**
 * GET /api/history?range=7D|30D|90D
 * Returns historical stablecoin supply data
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get("range") || "30D";
    
    // Validate range parameter
    const validRanges = ["7D", "30D", "90D"];
    const range = validRanges.includes(rangeParam) 
      ? (rangeParam as "7D" | "30D" | "90D")
      : "30D";

    const data = await getStablecoinHistory(range);

    return NextResponse.json({
      ...data,
      timestamp: new Date().toISOString(),
      success: true,
    });
  } catch (error) {
    console.error("Error fetching history data:", error);

    return NextResponse.json(
      {
        range: "30D",
        stablecoinSupplyTrend: [],
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
