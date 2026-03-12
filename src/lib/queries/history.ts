import { prisma } from "../db/prisma";
import { getDaysAgo } from "../utils/dates";

/**
 * Database queries for historical data
 */

export async function getRegimeHistory(days: number = 30) {
  const startDate = getDaysAgo(days);

  // TODO: Implement actual query
  console.log(`Fetching regime history from ${startDate}...`);

  // Placeholder
  return [
    {
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      regime: "expansion",
      score: 0.75,
    },
    {
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      regime: "neutral",
      score: 0.12,
    },
    {
      timestamp: new Date().toISOString(),
      regime: "expansion",
      score: 0.68,
    },
  ];
}

export async function getSupplyHistory(days: number = 30) {
  const startDate = getDaysAgo(days);

  // TODO: Implement actual query
  // Aggregate daily supply totals
  console.log(`Fetching supply history from ${startDate}...`);

  // Placeholder
  return [
    {
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalSupply: 140000000000,
    },
    {
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      totalSupply: 141000000000,
    },
    {
      timestamp: new Date().toISOString(),
      totalSupply: 142000000000,
    },
  ];
}

export async function getFlowHistory(days: number = 30) {
  const startDate = getDaysAgo(days);

  // TODO: Implement actual query
  // Aggregate daily net flows
  console.log(`Fetching flow history from ${startDate}...`);

  // Placeholder
  return [
    {
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      netFlow: 100000000,
    },
    {
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      netFlow: -50000000,
    },
    {
      timestamp: new Date().toISOString(),
      netFlow: 75000000,
    },
  ];
}
