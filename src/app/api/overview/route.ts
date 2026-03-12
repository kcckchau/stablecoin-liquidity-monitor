import { NextResponse } from "next/server";
import type { ApiResponse, OverviewResponse } from "@/types/api";
import {
  getTotalStablecoinSupply,
  getSupplyChange,
  getTopStablecoins,
  getNetExchangeFlow,
  getTopExchanges,
} from "@/lib/queries/overview";

export async function GET() {
  try {
    // Fetch all overview data
    const [
      totalStablecoinSupply,
      supplyChange24h,
      supplyChange7d,
      topStablecoins,
      netExchangeFlow24h,
      netExchangeFlow7d,
      topExchanges,
    ] = await Promise.all([
      getTotalStablecoinSupply(),
      getSupplyChange(1),
      getSupplyChange(7),
      getTopStablecoins(10),
      getNetExchangeFlow(1),
      getNetExchangeFlow(7),
      getTopExchanges(10),
    ]);

    const response: ApiResponse<OverviewResponse> = {
      data: {
        totalStablecoinSupply,
        supplyChange24h,
        supplyChange7d,
        topStablecoins,
        netExchangeFlow24h,
        netExchangeFlow7d,
        topExchanges,
      },
      timestamp: new Date().toISOString(),
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching overview data:", error);

    const response: ApiResponse<OverviewResponse> = {
      data: {
        totalStablecoinSupply: 0,
        supplyChange24h: 0,
        supplyChange7d: 0,
        topStablecoins: [],
        netExchangeFlow24h: 0,
        netExchangeFlow7d: 0,
        topExchanges: [],
      },
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
