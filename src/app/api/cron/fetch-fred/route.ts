/**
 * FRED Data Fetch Cron Job
 * 
 * Fetches latest FRED economic data (RRP, TGA) and stores in database.
 * Designed to run on a daily schedule via Vercel Cron.
 */

import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { fetchMultipleFredSeries } from "@/lib/data-sources/fred";
import { getAllFredSeriesIds } from "@/lib/constants/fred-series";
import { toPrismaFormat } from "@/lib/normalization/fred";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds max

/**
 * GET /api/cron/fetch-fred
 * 
 * Fetches latest FRED data and stores in database
 */
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Verify cron secret in production
    if (env.IS_PRODUCTION) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        console.warn("Unauthorized FRED cron attempt");
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    console.log("Starting FRED data fetch...");

    // Check if FRED API key is configured
    if (!env.FRED_API_KEY) {
      console.error("FRED_API_KEY not configured");
      return NextResponse.json(
        {
          success: false,
          error: "FRED_API_KEY not configured. Get one at: https://fred.stlouisfed.org/docs/api/api_key.html",
        },
        { status: 500 }
      );
    }

    // Get all FRED series IDs
    const seriesIds = getAllFredSeriesIds();
    console.log(`Fetching ${seriesIds.length} FRED series: ${seriesIds.join(", ")}`);

    // Fetch latest 10 observations for each series (to catch any missed updates)
    const results = await fetchMultipleFredSeries(seriesIds, {
      limit: 10,
      sortOrder: "desc",
    });

    let totalInserted = 0;
    let totalSkipped = 0;
    const summary: Array<{ seriesId: string; latest: string; value: number }> = [];

    // Store each observation
    for (const result of results) {
      let seriesInserted = 0;
      let latestValue = 0;
      let latestDate = "";

      for (const observation of result.observations) {
        try {
          const prismaData = toPrismaFormat(observation);

          // Upsert to handle duplicates gracefully
          await prisma.fredData.upsert({
            where: {
              seriesId_date: {
                seriesId: observation.seriesId,
                date: observation.date,
              },
            },
            create: prismaData,
            update: {
              value: prismaData.value,
              realtimeStart: prismaData.realtimeStart,
              realtimeEnd: prismaData.realtimeEnd,
            },
          });

          seriesInserted++;
          totalInserted++;

          // Track latest
          if (!latestDate || observation.date > new Date(latestDate)) {
            latestDate = observation.date.toISOString();
            latestValue = observation.value;
          }
        } catch (error) {
          console.error(
            `Failed to store ${observation.seriesId} observation for ${observation.date}:`,
            error
          );
          totalSkipped++;
        }
      }

      summary.push({
        seriesId: result.seriesId,
        latest: latestDate,
        value: latestValue,
      });

      console.log(`${result.seriesId}: Stored ${seriesInserted} observations`);
    }

    const duration = `${Date.now() - startTime}ms`;
    console.log(`FRED fetch complete: ${totalInserted} inserted, ${totalSkipped} skipped in ${duration}`);

    return NextResponse.json({
      success: true,
      inserted: totalInserted,
      skipped: totalSkipped,
      series: results.length,
      summary,
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const duration = `${Date.now() - startTime}ms`;
    console.error("FRED cron job failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
