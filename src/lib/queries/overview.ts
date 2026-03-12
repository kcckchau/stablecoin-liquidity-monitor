import { prisma } from "../db/prisma";
import { getDaysAgo } from "../utils/dates";
import { AggregatedSupply, AggregatedFlow } from "@/types/market-data";

/**
 * Database queries for overview/dashboard data
 */

export async function getTotalStablecoinSupply(): Promise<number> {
  // TODO: Implement actual query
  // Get the latest supply data for each stablecoin and sum them
  console.log("Querying total stablecoin supply...");

  // Placeholder
  return 142000000000; // $142B
}

export async function getSupplyChange(days: number): Promise<number> {
  // TODO: Implement supply change calculation
  // Compare current supply with supply from N days ago
  console.log(`Calculating supply change over ${days} days...`);

  // Placeholder
  return days === 1 ? 0.5 : 2.3; // percentage
}

export async function getTopStablecoins(limit: number = 10): Promise<AggregatedSupply[]> {
  // TODO: Implement query to get latest data for each stablecoin
  console.log(`Fetching top ${limit} stablecoins...`);

  // Placeholder
  return [
    {
      symbol: "USDT",
      totalSupply: 95000000000,
      totalMarketCap: 95000000000,
      changePercent24h: 0.3,
      changePercent7d: 1.2,
      timestamp: new Date(),
    },
    {
      symbol: "USDC",
      totalSupply: 42000000000,
      totalMarketCap: 42000000000,
      changePercent24h: 0.8,
      changePercent7d: 3.1,
      timestamp: new Date(),
    },
  ];
}

export async function getNetExchangeFlow(days: number): Promise<number> {
  // TODO: Implement net flow calculation
  // Sum all inflows - outflows over the time period
  const startDate = getDaysAgo(days);
  console.log(`Calculating net exchange flow from ${startDate}...`);

  // Placeholder
  return days === 1 ? 50000000 : 200000000; // USD
}

export async function getTopExchanges(limit: number = 10): Promise<AggregatedFlow[]> {
  // TODO: Implement query to get aggregated flow data by exchange
  console.log(`Fetching top ${limit} exchanges...`);

  // Placeholder
  return [
    {
      exchange: "binance",
      token: "USDT",
      netFlow: 50000000,
      netFlowUsd: 50000000,
      inflowTotal: 500000000,
      outflowTotal: 450000000,
      timestamp: new Date(),
    },
  ];
}
