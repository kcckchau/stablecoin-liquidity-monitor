import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { fetchExchangeFlows } from "@/lib/data-sources/exchange-flows";
import { normalizeExchangeFlowData } from "@/lib/normalization/exchange-flows";
import { MAJOR_STABLECOINS, MAJOR_EXCHANGES } from "@/lib/constants/regime";
import { prisma } from "@/lib/db/prisma";

/**
 * Cron endpoint to fetch and store exchange flow data
 * Should be triggered by Vercel Cron or external scheduler
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

    console.log("Fetching exchange flow data...");

    // Fetch from external API
    const rawData = await fetchExchangeFlows(
      [...MAJOR_EXCHANGES],
      [...MAJOR_STABLECOINS]
    );

    // Normalize data
    const normalizedData = normalizeExchangeFlowData(rawData);

    // TODO: Store in database
    // await prisma.exchangeFlow.createMany({
    //   data: normalizedData.map(item => ({
    //     exchange: item.exchange,
    //     token: item.token,
    //     flowType: item.flowType,
    //     amount: item.amount,
    //     amountUsd: item.amountUsd,
    //     timestamp: item.timestamp,
    //     source: item.source,
    //   })),
    // });

    console.log(`Successfully fetched and stored ${normalizedData.length} exchange flow records`);

    return NextResponse.json({
      success: true,
      count: normalizedData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in fetch-exchange-flows cron:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
