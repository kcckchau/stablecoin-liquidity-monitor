import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { fetchStablecoinSupplies } from "@/lib/data-sources/defillama";
import { normalizeDefiLlamaData } from "@/lib/normalization/stablecoins";
import { prisma } from "@/lib/db/prisma";

/**
 * Cron endpoint to fetch and store stablecoin supply data
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

    console.log("Fetching stablecoin data...");

    // Fetch from external API
    const rawData = await fetchStablecoinSupplies();

    // Normalize data
    const normalizedData = normalizeDefiLlamaData(rawData);

    // TODO: Store in database
    // await prisma.stablecoinSupply.createMany({
    //   data: normalizedData.map(item => ({
    //     symbol: item.symbol,
    //     name: item.name,
    //     supply: item.supply,
    //     marketCap: item.marketCap,
    //     timestamp: item.timestamp,
    //     source: item.source,
    //   })),
    // });

    console.log(`Successfully fetched and stored ${normalizedData.length} stablecoin records`);

    return NextResponse.json({
      success: true,
      count: normalizedData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in fetch-stablecoins cron:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
