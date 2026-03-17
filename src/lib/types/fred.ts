/**
 * FRED API Types
 * 
 * Type definitions for FRED API requests and responses.
 */

import { FredSeriesId } from "@/lib/constants/fred-series";

/**
 * Raw FRED API response structure
 * 
 * @see https://fred.stlouisfed.org/docs/api/fred/series_observations.html
 */
export interface FredApiResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FredObservation[];
}

/**
 * Individual observation from FRED API
 */
export interface FredObservation {
  realtime_start: string;
  realtime_end: string;
  date: string; // YYYY-MM-DD
  value: string; // Numeric value as string, or "." for missing data
}

/**
 * Normalized FRED data point (internal representation)
 */
export interface FredDataPoint {
  seriesId: FredSeriesId;
  date: Date;
  value: number;
  units: string;
  realtimeStart: Date;
  realtimeEnd: Date;
}

/**
 * Options for fetching FRED series data
 */
export interface FredFetchOptions {
  seriesId: FredSeriesId;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

/**
 * Result of fetching FRED data
 */
export interface FredFetchResult {
  seriesId: FredSeriesId;
  observations: FredDataPoint[];
  totalCount: number;
  observationStart: string;
  observationEnd: string;
}
