import { NextResponse } from "next/server";
import { getSupplyHistory } from "@/lib/queries/history";

/**
 * GET /api/stablecoin/history?days=7|30|90
 * Returns stablecoin supply history for chart visualization
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");

    // Validate days parameter
    const allowedDays = [7, 30, 90];
    const days = parseInt(daysParam || "7", 10);

    if (!allowedDays.includes(days)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid days parameter. Allowed values: ${allowedDays.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Fetch history from query layer
    const supplyHistory = await getSupplyHistory(days);

    // Transform to chart-ready format
    const chartData = supplyHistory.map(point => ({
      timestamp: point.timestamp,
      total: point.totalSupply,
      usdt: point.bySymbol?.USDT || 0,
      usdc: point.bySymbol?.USDC || 0,
      dai: point.bySymbol?.DAI || 0,
    }));

    return NextResponse.json({
      success: true,
      days,
      data: chartData,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error in /api/stablecoin/history:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        days: null,
        data: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
