/**
 * FRED (Federal Reserve Economic Data) API Client
 * 
 * Fetches economic time series data from the St. Louis Federal Reserve.
 * 
 * @see https://fred.stlouisfed.org/docs/api/fred/
 */

import { env } from "@/config/env";
import type {
  FredApiResponse,
  FredFetchOptions,
  FredFetchResult,
} from "@/lib/types/fred";
import { normalizeFredResponse } from "@/lib/normalization/fred";

/**
 * Base URL for FRED API
 */
const FRED_API_BASE_URL = "https://api.stlouisfed.org/fred";

/**
 * Default options for FRED API requests
 */
const DEFAULT_OPTIONS = {
  limit: 1000,
  sortOrder: "asc" as const,
};

/**
 * Fetch observations for a specific FRED series
 * 
 * @param options - Fetch options including series ID and date range
 * @returns Normalized FRED data
 * @throws Error if API key is missing or API request fails
 * 
 * @example
 * ```ts
 * const rrpData = await fetchFredSeries({
 *   seriesId: FRED_SERIES.RRP,
 *   startDate: new Date("2024-01-01"),
 *   endDate: new Date("2024-12-31"),
 * });
 * ```
 */
export async function fetchFredSeries(
  options: FredFetchOptions
): Promise<FredFetchResult> {
  const { seriesId, startDate, endDate, limit, sortOrder } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // Validate API key
  if (!env.FRED_API_KEY) {
    throw new Error(
      "FRED_API_KEY is not configured. Get one at: https://fred.stlouisfed.org/docs/api/api_key.html"
    );
  }

  // Build query parameters
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: env.FRED_API_KEY,
    file_type: "json",
    limit: limit.toString(),
    sort_order: sortOrder,
  });

  if (startDate) {
    params.append("observation_start", formatDateForFred(startDate));
  }

  if (endDate) {
    params.append("observation_end", formatDateForFred(endDate));
  }

  // Make API request
  const url = `${FRED_API_BASE_URL}/series/observations?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `FRED API error (${response.status}): ${errorText}`
      );
    }

    const data: FredApiResponse = await response.json();

    // Normalize and return
    return normalizeFredResponse(data, seriesId);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch FRED series ${seriesId}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Fetch the most recent observation for a series
 * 
 * @param seriesId - FRED series ID
 * @returns Most recent data point
 * 
 * @example
 * ```ts
 * const latestRRP = await fetchLatestFredObservation(FRED_SERIES.RRP);
 * console.log(`Latest RRP: ${latestRRP.value} billion`);
 * ```
 */
export async function fetchLatestFredObservation(seriesId: string) {
  const result = await fetchFredSeries({
    seriesId: seriesId as any,
    limit: 1,
    sortOrder: "desc",
  });

  if (result.observations.length === 0) {
    throw new Error(`No observations found for series ${seriesId}`);
  }

  return result.observations[0];
}

/**
 * Fetch multiple FRED series in parallel
 * 
 * @param seriesIds - Array of series IDs to fetch
 * @param options - Common fetch options for all series
 * @returns Array of fetch results
 * 
 * @example
 * ```ts
 * const [rrp, tga] = await fetchMultipleFredSeries(
 *   [FRED_SERIES.RRP, FRED_SERIES.TGA],
 *   { startDate: new Date("2024-01-01") }
 * );
 * ```
 */
export async function fetchMultipleFredSeries(
  seriesIds: string[],
  options: Omit<FredFetchOptions, "seriesId"> = {}
): Promise<FredFetchResult[]> {
  const promises = seriesIds.map((seriesId) =>
    fetchFredSeries({ ...options, seriesId: seriesId as any })
  );

  return Promise.all(promises);
}

/**
 * Format a Date object to FRED's expected format (YYYY-MM-DD)
 */
function formatDateForFred(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Fetch series metadata (not observations, just info about the series)
 * 
 * @param seriesId - FRED series ID
 * @returns Series metadata
 * 
 * Note: This is a placeholder for future implementation.
 * FRED provides a separate endpoint for series metadata.
 */
export async function fetchFredSeriesMetadata(seriesId: string) {
  // TODO: Implement when needed
  // Endpoint: /fred/series?series_id={seriesId}
  throw new Error("fetchFredSeriesMetadata not implemented yet");
}
