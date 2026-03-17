/**
 * FRED Data Query Helpers
 * 
 * Database queries for FRED economic data.
 */

import { prisma } from "@/lib/db";
import type { FredSeriesId } from "@/lib/constants/fred-series";
import { fromPrismaFormat } from "@/lib/normalization/fred";
import type { FredDataPoint } from "@/lib/types/fred";

/**
 * Get the most recent observation for a FRED series
 * 
 * @param seriesId - FRED series ID
 * @returns Latest data point, or null if not found
 */
export async function getLatestFredObservation(
  seriesId: FredSeriesId
): Promise<FredDataPoint | null> {
  const record = await prisma.fredData.findFirst({
    where: { seriesId },
    orderBy: { date: "desc" },
  });

  if (!record) return null;

  return fromPrismaFormat(record);
}

/**
 * Get FRED observations for a specific date range
 * 
 * @param seriesId - FRED series ID
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns Array of data points
 */
export async function getFredObservations(
  seriesId: FredSeriesId,
  startDate: Date,
  endDate: Date = new Date()
): Promise<FredDataPoint[]> {
  const records = await prisma.fredData.findMany({
    where: {
      seriesId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "asc" },
  });

  return records.map(fromPrismaFormat);
}

/**
 * Get FRED observations for the last N days
 * 
 * @param seriesId - FRED series ID
 * @param days - Number of days to look back
 * @returns Array of data points
 */
export async function getRecentFredObservations(
  seriesId: FredSeriesId,
  days: number = 30
): Promise<FredDataPoint[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return getFredObservations(seriesId, startDate);
}

/**
 * Get all FRED series with their latest observations
 * 
 * @returns Map of series ID to latest data point
 */
export async function getAllLatestFredObservations(): Promise<
  Map<string, FredDataPoint>
> {
  // Get all unique series IDs
  const seriesIds = await prisma.fredData.findMany({
    distinct: ["seriesId"],
    select: { seriesId: true },
  });

  // Fetch latest for each
  const results = await Promise.all(
    seriesIds.map(async ({ seriesId }) => {
      const latest = await getLatestFredObservation(seriesId as FredSeriesId);
      return { seriesId, latest };
    })
  );

  // Build map
  const map = new Map<string, FredDataPoint>();
  results.forEach(({ seriesId, latest }) => {
    if (latest) {
      map.set(seriesId, latest);
    }
  });

  return map;
}

/**
 * Calculate the change in a FRED series over a period
 * 
 * @param seriesId - FRED series ID
 * @param days - Number of days to look back
 * @returns Object with current, previous, and change values
 */
export async function getFredChangeOverPeriod(
  seriesId: FredSeriesId,
  days: number = 7
) {
  const [latest, observations] = await Promise.all([
    getLatestFredObservation(seriesId),
    getRecentFredObservations(seriesId, days + 7), // Get extra days for buffer
  ]);

  if (!latest || observations.length === 0) {
    return null;
  }

  // Find observation closest to N days ago
  const targetDate = new Date(latest.date);
  targetDate.setDate(targetDate.getDate() - days);

  const previous = observations.reduce((closest, obs) => {
    const obsTime = obs.date.getTime();
    const targetTime = targetDate.getTime();
    const closestTime = closest.date.getTime();

    return Math.abs(obsTime - targetTime) < Math.abs(closestTime - targetTime)
      ? obs
      : closest;
  });

  const absoluteChange = latest.value - previous.value;
  const percentChange =
    previous.value !== 0 ? (absoluteChange / previous.value) * 100 : 0;

  return {
    current: latest,
    previous,
    change: {
      absolute: absoluteChange,
      percent: percentChange,
      direction:
        absoluteChange > 0
          ? ("increase" as const)
          : absoluteChange < 0
            ? ("decrease" as const)
            : ("unchanged" as const),
    },
  };
}

/**
 * Check if FRED data exists for a given series
 * 
 * @param seriesId - FRED series ID
 * @returns True if data exists
 */
export async function hasFredData(seriesId: FredSeriesId): Promise<boolean> {
  const count = await prisma.fredData.count({
    where: { seriesId },
  });

  return count > 0;
}

/**
 * Get the date range of available data for a series
 * 
 * @param seriesId - FRED series ID
 * @returns Object with earliest and latest dates, or null if no data
 */
export async function getFredDataRange(seriesId: FredSeriesId) {
  const [earliest, latest] = await Promise.all([
    prisma.fredData.findFirst({
      where: { seriesId },
      orderBy: { date: "asc" },
      select: { date: true },
    }),
    prisma.fredData.findFirst({
      where: { seriesId },
      orderBy: { date: "desc" },
      select: { date: true },
    }),
  ]);

  if (!earliest || !latest) {
    return null;
  }

  return {
    earliest: earliest.date,
    latest: latest.date,
    days: Math.floor(
      (latest.date.getTime() - earliest.date.getTime()) / (1000 * 60 * 60 * 24)
    ),
  };
}

/**
 * Get summary statistics for a FRED series over a period
 * 
 * @param seriesId - FRED series ID
 * @param days - Number of days to analyze
 * @returns Statistical summary
 */
export async function getFredStatistics(
  seriesId: FredSeriesId,
  days: number = 30
) {
  const observations = await getRecentFredObservations(seriesId, days);

  if (observations.length === 0) {
    return null;
  }

  const values = observations.map((obs) => obs.value);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;

  const sortedValues = [...values].sort((a, b) => a - b);
  const median =
    sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] +
          sortedValues[sortedValues.length / 2]) /
        2
      : sortedValues[Math.floor(sortedValues.length / 2)];

  const variance =
    values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  return {
    count: observations.length,
    mean,
    median,
    min: Math.min(...values),
    max: Math.max(...values),
    stdDev,
    range: Math.max(...values) - Math.min(...values),
    latest: observations[observations.length - 1],
    earliest: observations[0],
  };
}

/**
 * Get FRED overview data for dashboard
 * 
 * Fetches latest RRP and TGA values with 7-day and 30-day changes
 * 
 * @returns Overview data for all FRED series
 */
export async function getFredOverview() {
  const { FRED_SERIES } = await import("@/lib/constants/fred-series");

  // Fetch latest and changes for both series
  const [rrpLatest, rrpChange7d, rrpChange30d, tgaLatest, tgaChange7d, tgaChange30d] =
    await Promise.all([
      getLatestFredObservation(FRED_SERIES.RRP),
      getFredChangeOverPeriod(FRED_SERIES.RRP, 7),
      getFredChangeOverPeriod(FRED_SERIES.RRP, 30),
      getLatestFredObservation(FRED_SERIES.TGA),
      getFredChangeOverPeriod(FRED_SERIES.TGA, 7),
      getFredChangeOverPeriod(FRED_SERIES.TGA, 30),
    ]);

  return {
    rrp: {
      latest: rrpLatest,
      change7d: rrpChange7d?.change || null,
      change30d: rrpChange30d?.change || null,
      lastUpdated: rrpLatest?.date.toISOString() || null,
    },
    tga: {
      latest: tgaLatest,
      change7d: tgaChange7d?.change || null,
      change30d: tgaChange30d?.change || null,
      lastUpdated: tgaLatest?.date.toISOString() || null,
    },
    hasData: !!(rrpLatest || tgaLatest),
  };
}
