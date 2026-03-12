import { NextResponse } from "next/server";
import type { ApiResponse, RegimeResponse } from "@/types/api";
import { getCurrentRegime } from "@/lib/queries/regime";
import { generateRegimeSignals } from "@/lib/regime-engine/compute-regime";

export async function GET() {
  try {
    // Fetch current regime data
    const currentRegime = await getCurrentRegime();

    if (!currentRegime) {
      throw new Error("No regime data available");
    }

    // Generate signals based on regime
    const signals = generateRegimeSignals(currentRegime);

    const response: ApiResponse<RegimeResponse> = {
      data: {
        current: currentRegime,
        signals,
        lastUpdate: currentRegime.timestamp.toISOString(),
      },
      timestamp: new Date().toISOString(),
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching regime data:", error);

    const response: ApiResponse<RegimeResponse> = {
      data: {
        current: {
          regime: "unknown",
          score: 0,
          supplyTrend: "stable",
          flowTrend: "neutral",
          volatility: 0,
          confidence: 0,
          timestamp: new Date(),
        },
        signals: [],
        lastUpdate: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
