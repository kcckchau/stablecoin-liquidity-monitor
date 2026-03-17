/**
 * FRED Data Normalization
 * 
 * Converts raw FRED API responses into typed internal data structures.
 */

import type {
  FredApiResponse,
  FredObservation,
  FredDataPoint,
  FredFetchResult,
} from "@/lib/types/fred";
import type { FredSeriesId } from "@/lib/constants/fred-series";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Normalize a raw FRED API response into internal format
 * 
 * @param response - Raw FRED API response
 * @param seriesId - Series ID for this data
 * @returns Normalized fetch result with typed data points
 */
export function normalizeFredResponse(
  response: FredApiResponse,
  seriesId: FredSeriesId
): FredFetchResult {
  const observations = response.observations
    .map((obs) => normalizeFredObservation(obs, seriesId, response.units))
    .filter((obs): obs is FredDataPoint => obs !== null);

  return {
    seriesId,
    observations,
    totalCount: response.count,
    observationStart: response.observation_start,
    observationEnd: response.observation_end,
  };
}

/**
 * Normalize a single FRED observation
 * 
 * @param observation - Raw observation from FRED API
 * @param seriesId - Series ID
 * @param units - Units for this series
 * @returns Normalized data point, or null if invalid
 */
export function normalizeFredObservation(
  observation: FredObservation,
  seriesId: FredSeriesId,
  units: string
): FredDataPoint | null {
  // FRED uses "." to indicate missing data
  if (observation.value === "." || observation.value === "") {
    return null;
  }

  const value = parseFloat(observation.value);
  if (isNaN(value)) {
    console.warn(
      `Invalid FRED value for ${seriesId} on ${observation.date}: ${observation.value}`
    );
    return null;
  }

  return {
    seriesId,
    date: new Date(observation.date),
    value,
    units,
    realtimeStart: new Date(observation.realtime_start),
    realtimeEnd: new Date(observation.realtime_end),
  };
}

/**
 * Convert normalized FRED data to Prisma format
 * 
 * Prepares data for database insertion.
 * 
 * @param dataPoint - Normalized FRED data point
 * @returns Object ready for Prisma create/upsert
 */
export function toPrismaFormat(dataPoint: FredDataPoint) {
  return {
    seriesId: dataPoint.seriesId,
    date: dataPoint.date,
    value: new Decimal(dataPoint.value),
    units: dataPoint.units,
    realtimeStart: dataPoint.realtimeStart,
    realtimeEnd: dataPoint.realtimeEnd,
  };
}

/**
 * Convert Prisma FRED record back to internal format
 * 
 * @param record - Prisma FRED record
 * @returns Normalized FRED data point
 */
export function fromPrismaFormat(record: {
  seriesId: string;
  date: Date;
  value: Decimal;
  units: string;
  realtimeStart: Date;
  realtimeEnd: Date;
}): FredDataPoint {
  return {
    seriesId: record.seriesId as FredSeriesId,
    date: record.date,
    value: record.value.toNumber(),
    units: record.units,
    realtimeStart: record.realtimeStart,
    realtimeEnd: record.realtimeEnd,
  };
}

/**
 * Format FRED value for display
 * 
 * @param value - Numeric value
 * @param units - Units string from FRED
 * @returns Formatted string
 * 
 * @example
 * ```ts
 * formatFredValue(2500, "Billions of Dollars") // "2.50T"
 * formatFredValue(150000, "Millions of Dollars") // "150.00B"
 * ```
 */
export function formatFredValue(value: number, units: string): string {
  // Handle billions
  if (units.includes("Billions")) {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}T`;
    }
    return `${value.toFixed(2)}B`;
  }

  // Handle millions
  if (units.includes("Millions")) {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}T`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}B`;
    }
    return `${value.toFixed(2)}M`;
  }

  // Default: just format with commas
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculate the change between two FRED values
 * 
 * @param current - Current value
 * @param previous - Previous value
 * @returns Object with absolute and percentage change
 */
export function calculateFredChange(current: number, previous: number) {
  const absoluteChange = current - previous;
  const percentChange = previous !== 0 ? (absoluteChange / previous) * 100 : 0;

  return {
    absolute: absoluteChange,
    percent: percentChange,
    direction: absoluteChange > 0 ? "increase" : absoluteChange < 0 ? "decrease" : "unchanged",
  };
}

/**
 * Aggregate FRED data by time period
 * 
 * @param dataPoints - Array of data points
 * @param period - Aggregation period ("daily" | "weekly" | "monthly")
 * @returns Aggregated data points
 */
export function aggregateFredData(
  dataPoints: FredDataPoint[],
  period: "daily" | "weekly" | "monthly" = "daily"
): FredDataPoint[] {
  if (period === "daily") {
    return dataPoints;
  }

  // Group by period
  const grouped = new Map<string, FredDataPoint[]>();

  dataPoints.forEach((point) => {
    let key: string;

    if (period === "weekly") {
      // Group by week (ISO week)
      const weekStart = getWeekStart(point.date);
      key = weekStart.toISOString().split("T")[0];
    } else {
      // Group by month
      const year = point.date.getFullYear();
      const month = point.date.getMonth();
      key = `${year}-${String(month + 1).padStart(2, "0")}`;
    }

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(point);
  });

  // Take the last value in each period
  return Array.from(grouped.entries()).map(([_, points]) => {
    const sorted = points.sort((a, b) => a.date.getTime() - b.date.getTime());
    return sorted[sorted.length - 1];
  });
}

/**
 * Get the start of the week for a given date (Monday)
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}
