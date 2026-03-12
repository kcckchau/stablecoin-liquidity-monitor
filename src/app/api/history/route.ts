import { NextResponse } from "next/server";
import type { ApiResponse, HistoryResponse } from "@/types/api";
import {
  getRegimeHistory,
  getSupplyHistory,
  getFlowHistory,
} from "@/lib/queries/history";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    // Fetch historical data
    const [regimeHistory, supplyHistory, flowHistory] = await Promise.all([
      getRegimeHistory(days),
      getSupplyHistory(days),
      getFlowHistory(days),
    ]);

    const response: ApiResponse<HistoryResponse> = {
      data: {
        regimeHistory,
        supplyHistory,
        flowHistory,
      },
      timestamp: new Date().toISOString(),
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching history data:", error);

    const response: ApiResponse<HistoryResponse> = {
      data: {
        regimeHistory: [],
        supplyHistory: [],
        flowHistory: [],
      },
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
