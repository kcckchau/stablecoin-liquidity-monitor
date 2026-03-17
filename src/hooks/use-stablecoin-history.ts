"use client";

import { useState, useEffect } from "react";

export interface StablecoinHistoryChartPoint {
  timestamp: string;
  total: number;
  usdt: number;
  usdc: number;
  dai: number;
}

export interface UseStablecoinHistoryResult {
  data: StablecoinHistoryChartPoint[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Client hook to fetch stablecoin history from API
 * Manages loading, error, and data state
 * 
 * @param days - Number of days (7, 30, or 90)
 * @returns Result with data, isLoading, and error
 */
export function useStablecoinHistory(days: 7 | 30 | 90): UseStablecoinHistoryResult {
  const [data, setData] = useState<StablecoinHistoryChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;

    async function fetchHistory() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/stablecoin/history?days=${days}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Ignore stale requests if component unmounted or days changed
        if (aborted) return;

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch history");
        }

        setData(result.data || []);
        setError(null);
      } catch (err) {
        if (aborted) return;
        
        console.error("Error fetching stablecoin history:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setData([]);
      } finally {
        if (!aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchHistory();

    // Cleanup function to abort stale requests
    return () => {
      aborted = true;
    };
  }, [days]);

  return { data, isLoading, error };
}
