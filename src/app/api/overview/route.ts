import { NextResponse } from "next/server";
import { getLatestStablecoinOverview } from "@/lib/queries/overview";

/**
 * GET /api/overview
 * Returns latest stablecoin overview metrics
 */
export async function GET() {
  try {
    const data = await getLatestStablecoinOverview();

    return NextResponse.json({
      ...data,
      timestamp: new Date().toISOString(),
      success: true,
    });
  } catch (error) {
    console.error("Error fetching overview data:", error);

    return NextResponse.json(
      {
        metrics: {
          usdtNetMint7d: null,
          usdcNetMint7d: null,
          totalSupplyChange7d: null,
          liquidityRegimeLabel: "Error",
          liquidityRegimeScore: null,
          exchangeNetflow: null,
        },
        stablecoin: {
          totalSupplyLatest: null,
          totalSupply7dAgo: null,
          lastUpdated: null,
        },
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
