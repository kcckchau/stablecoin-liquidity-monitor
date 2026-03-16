import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { fetchStablecoinSupplies } from "@/lib/data-sources/defillama";
import { normalizeDefiLlamaData, toPrismaFormat } from "@/lib/normalization/stablecoins";
import { prisma } from "@/lib/db/prisma";

/**
 * Cron endpoint to fetch and store stablecoin supply data
 * Should be triggered by Vercel Cron or external scheduler
 * 
 * Recommended schedule: Every hour (0 * * * *)
 */

export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Verify cron secret if in production
    if (env.IS_PRODUCTION) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        console.warn("Unauthorized cron request attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("🔄 Starting stablecoin data fetch...");

    // Fetch from DefiLlama API
    const rawData = await fetchStablecoinSupplies();

    if (rawData.length === 0) {
      console.warn("⚠️ No stablecoin data returned from API");
      return NextResponse.json({
        success: false,
        error: "No data returned from API",
      }, { status: 500 });
    }

    // Normalize data to internal format
    const normalizedData = normalizeDefiLlamaData(rawData);

    // Store in database
    const insertedRecords = [];
    for (const item of normalizedData) {
      try {
        const prismaData = toPrismaFormat(item);
        const record = await prisma.stablecoinSupply.create({
          data: prismaData,
        });
        insertedRecords.push(record);
      } catch (error) {
        console.error(`Failed to insert ${item.symbol}:`, error);
        // Continue with other records even if one fails
      }
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Successfully stored ${insertedRecords.length}/${normalizedData.length} stablecoin records in ${duration}ms`);

    return NextResponse.json({
      success: true,
      count: insertedRecords.length,
      total: normalizedData.length,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      stablecoins: insertedRecords.map(r => ({
        symbol: r.symbol,
        supply: r.supply.toString(),
        timestamp: r.timestamp.toISOString(),
      })),
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("❌ Error in fetch-stablecoins cron:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Allow POST for manual triggers (development/testing)
 */
export async function POST(request: Request) {
  return GET(request);
}
