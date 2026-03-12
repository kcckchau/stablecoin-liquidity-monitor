import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { computeLiquidityRegime } from "@/lib/regime-engine/compute-regime";
import { getRegimeMetrics } from "@/lib/queries/regime";
import { prisma } from "@/lib/db/prisma";

/**
 * Cron endpoint to compute and store liquidity regime
 * Should be triggered after data fetching crons complete
 */

export async function GET(request: Request) {
  try {
    // Verify cron secret if in production
    if (env.IS_PRODUCTION) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("Computing liquidity regime...");

    // Fetch metrics needed for regime computation
    const metrics = await getRegimeMetrics(30);

    // TODO: Fetch historical scores for momentum calculation
    const historicalScores: number[] = [];

    // Compute regime
    const regimeData = await computeLiquidityRegime({
      supplyChange7d: metrics.supplyChange7d,
      supplyChange30d: metrics.supplyChange30d,
      netFlow7d: metrics.netFlow7d,
      netFlow30d: metrics.netFlow30d,
      volatility7d: metrics.volatility7d,
      historicalScores,
    });

    // TODO: Store in database
    // await prisma.liquidityRegime.create({
    //   data: {
    //     regime: regimeData.regime,
    //     score: regimeData.score,
    //     supplyTrend: regimeData.supplyTrend,
    //     flowTrend: regimeData.flowTrend,
    //     volatility: regimeData.volatility,
    //     confidence: regimeData.confidence,
    //     timestamp: regimeData.timestamp,
    //   },
    // });

    console.log(`Successfully computed regime: ${regimeData.regime} (score: ${regimeData.score})`);

    return NextResponse.json({
      success: true,
      regime: regimeData.regime,
      score: regimeData.score,
      timestamp: regimeData.timestamp.toISOString(),
    });
  } catch (error) {
    console.error("Error in compute-regime cron:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
