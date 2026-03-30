import { prisma } from "../db/prisma";
import { getDaysAgo } from "../utils/dates";
import { AggregatedSupply, AggregatedFlow } from "@/types/market-data";

/**
 * Database queries for overview/dashboard data
 */

/**
 * Get the total stablecoin supply across all major stablecoins
 * Uses the most recent data point for each stablecoin
 */
export async function getTotalStablecoinSupply(): Promise<number> {
  try {
    // Get the latest timestamp for each symbol
    const latestRecords = await prisma.stablecoinSupply.groupBy({
      by: ['symbol'],
      _max: {
        timestamp: true,
      },
    });

    // Get the actual records for those latest timestamps
    const supplies = await Promise.all(
      latestRecords.map(async (record) => {
        const latest = await prisma.stablecoinSupply.findFirst({
          where: {
            symbol: record.symbol,
            timestamp: record._max.timestamp!,
          },
          select: {
            supply: true,
          },
        });
        return latest?.supply.toNumber() || 0;
      })
    );

    const total = supplies.reduce((sum, supply) => sum + supply, 0);
    console.log(`✓ Total stablecoin supply: $${(total / 1e9).toFixed(2)}B`);
    return total;

  } catch (error) {
    console.error("Error fetching total stablecoin supply:", error);
    return 0;
  }
}

/**
 * Calculate supply change percentage over a given number of days
 */
export async function getSupplyChange(days: number): Promise<number> {
  try {
    const now = new Date();
    const pastDate = getDaysAgo(days);

    // Get current total supply
    const currentSupply = await getTotalStablecoinSupply();

    // Get supply from N days ago
    const pastRecords = await prisma.stablecoinSupply.findMany({
      where: {
        timestamp: {
          gte: pastDate,
          lte: new Date(pastDate.getTime() + 24 * 60 * 60 * 1000), // +1 day window
        },
      },
      select: {
        symbol: true,
        supply: true,
      },
    });

    // Group by symbol and sum
    const pastSupplyMap = new Map<string, number>();
    pastRecords.forEach(record => {
      const current = pastSupplyMap.get(record.symbol) || 0;
      pastSupplyMap.set(record.symbol, current + record.supply.toNumber());
    });

    const pastSupply = Array.from(pastSupplyMap.values()).reduce((sum, val) => sum + val, 0);

    if (pastSupply === 0) {
      console.warn(`No supply data found for ${days} days ago`);
      return 0;
    }

    const changePercent = ((currentSupply - pastSupply) / pastSupply) * 100;
    console.log(`✓ Supply change (${days}d): ${changePercent.toFixed(2)}%`);
    return changePercent;

  } catch (error) {
    console.error(`Error calculating supply change for ${days} days:`, error);
    return 0;
  }
}

/**
 * Get the top stablecoins with their current supply and change metrics
 */
export async function getTopStablecoins(limit: number = 10): Promise<AggregatedSupply[]> {
  try {
    const majorSymbols = ["USDT", "USDC", "DAI"];
    
    // Get latest data for each symbol
    const latestRecords = await prisma.stablecoinSupply.groupBy({
      by: ['symbol'],
      where: {
        symbol: {
          in: majorSymbols,
        },
      },
      _max: {
        timestamp: true,
      },
    });

    const stablecoins = await Promise.all(
      latestRecords.map(async (record) => {
        // Get current data
        const current = await prisma.stablecoinSupply.findFirst({
          where: {
            symbol: record.symbol,
            timestamp: record._max.timestamp!,
          },
        });

        if (!current) return null;

        // Get 24h ago data
        const date24hAgo = getDaysAgo(1);
        const data24h = await prisma.stablecoinSupply.findFirst({
          where: {
            symbol: record.symbol,
            timestamp: {
              gte: date24hAgo,
              lte: new Date(date24hAgo.getTime() + 24 * 60 * 60 * 1000),
            },
          },
          orderBy: {
            timestamp: 'desc',
          },
        });

        // Get 7d ago data
        const date7dAgo = getDaysAgo(7);
        const data7d = await prisma.stablecoinSupply.findFirst({
          where: {
            symbol: record.symbol,
            timestamp: {
              gte: date7dAgo,
              lte: new Date(date7dAgo.getTime() + 24 * 60 * 60 * 1000),
            },
          },
          orderBy: {
            timestamp: 'desc',
          },
        });

        const currentSupply = current.supply.toNumber();
        const changePercent24h = data24h 
          ? ((currentSupply - data24h.supply.toNumber()) / data24h.supply.toNumber()) * 100
          : 0;
        const changePercent7d = data7d
          ? ((currentSupply - data7d.supply.toNumber()) / data7d.supply.toNumber()) * 100
          : 0;

        return {
          symbol: current.symbol,
          totalSupply: currentSupply,
          totalMarketCap: current.marketCap.toNumber(),
          changePercent24h,
          changePercent7d,
          timestamp: current.timestamp,
        };
      })
    );

    const validStablecoins = stablecoins.filter((s): s is AggregatedSupply => s !== null);
    console.log(`✓ Fetched ${validStablecoins.length} stablecoins`);
    return validStablecoins.slice(0, limit);

  } catch (error) {
    console.error("Error fetching top stablecoins:", error);
    return [];
  }
}

/**
 * Calculate net exchange flow over a given time period
 * Returns the net flow in USD (inflows - outflows)
 */
export async function getNetExchangeFlow(days: number): Promise<number> {
  try {
    const startDate = getDaysAgo(days);

    const flows = await prisma.exchangeFlow.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      select: {
        flowType: true,
        amountUsd: true,
      },
    });

    let netFlow = 0;
    flows.forEach(flow => {
      const amount = flow.amountUsd.toNumber();
      if (flow.flowType === 'inflow') {
        netFlow += amount;
      } else {
        netFlow -= amount;
      }
    });

    console.log(`✓ Net exchange flow (${days}d): $${(netFlow / 1e6).toFixed(2)}M`);
    return netFlow;

  } catch (error) {
    console.error(`Error calculating net exchange flow for ${days} days:`, error);
    return 0;
  }
}

/**
 * Get latest stablecoin overview data for the API
 * Returns structured data matching the /api/overview spec
 */
export async function getLatestStablecoinOverview() {
  try {
    const [totalSupply, supplyChange7d, topStablecoins] = await Promise.all([
      getTotalStablecoinSupply(),
      getSupplyChange(7),
      getTopStablecoins(3),
    ]);

    // Get supply from 7 days ago
    const pastDate = getDaysAgo(7);
    const pastRecords = await prisma.stablecoinSupply.findMany({
      where: {
        timestamp: {
          gte: pastDate,
          lte: new Date(pastDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      select: {
        symbol: true,
        supply: true,
      },
    });

    const pastSupplyMap = new Map<string, number>();
    pastRecords.forEach(record => {
      const current = pastSupplyMap.get(record.symbol) || 0;
      pastSupplyMap.set(record.symbol, Math.max(current, record.supply.toNumber()));
    });

    const totalSupply7dAgo = Array.from(pastSupplyMap.values()).reduce((sum, val) => sum + val, 0);

    // Find USDT and USDC for net mint calculations
    const usdtData = topStablecoins.find(s => s.symbol === "USDT");
    const usdcData = topStablecoins.find(s => s.symbol === "USDC");

    // Calculate net mint (7d change in supply)
    const usdtNetMint7d = usdtData 
      ? (usdtData.totalSupply * usdtData.changePercent7d / 100)
      : null;
    
    const usdcNetMint7d = usdcData
      ? (usdcData.totalSupply * usdcData.changePercent7d / 100)
      : null;

    // Simple regime calculation based on supply change
    const liquidityRegimeLabel = supplyChange7d > 0.5 
      ? "Risk ON" 
      : supplyChange7d < -0.5 
      ? "Risk OFF" 
      : "Neutral";
    
    const liquidityRegimeScore = Math.min(100, Math.max(0, 50 + (supplyChange7d * 10)));

    // Get last update timestamp
    const lastUpdated = topStablecoins.length > 0 
      ? topStablecoins[0].timestamp.toISOString()
      : null;

    return {
      metrics: {
        usdtNetMint7d,
        usdcNetMint7d,
        usdtChange7d: usdtData?.changePercent7d ?? null,
        usdcChange7d: usdcData?.changePercent7d ?? null,
        totalSupplyChange7d: supplyChange7d,
        liquidityRegimeLabel,
        liquidityRegimeScore,
        exchangeNetflow: null, // Not implemented yet
      },
      stablecoin: {
        totalSupplyLatest: totalSupply,
        totalSupply7dAgo: totalSupply7dAgo || null,
        lastUpdated,
      },
    };
  } catch (error) {
    console.error("Error fetching latest stablecoin overview:", error);
    throw error;
  }
}

/**
 * Get aggregated flow data by exchange
 */
export async function getTopExchanges(limit: number = 10): Promise<AggregatedFlow[]> {
  try {
    const flows = await prisma.exchangeFlow.findMany({
      where: {
        timestamp: {
          gte: getDaysAgo(7), // Last 7 days
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Aggregate by exchange and token
    const aggregated = new Map<string, AggregatedFlow>();

    flows.forEach(flow => {
      const key = `${flow.exchange}-${flow.token}`;
      const existing = aggregated.get(key);

      if (!existing) {
        aggregated.set(key, {
          exchange: flow.exchange,
          token: flow.token,
          netFlow: 0,
          netFlowUsd: 0,
          inflowTotal: 0,
          outflowTotal: 0,
          timestamp: flow.timestamp,
        });
      }

      const record = aggregated.get(key)!;
      const amount = flow.amount.toNumber();
      const amountUsd = flow.amountUsd.toNumber();

      if (flow.flowType === 'inflow') {
        record.inflowTotal += amount;
        record.netFlow += amount;
        record.netFlowUsd += amountUsd;
      } else {
        record.outflowTotal += amount;
        record.netFlow -= amount;
        record.netFlowUsd -= amountUsd;
      }
    });

    const result = Array.from(aggregated.values())
      .sort((a, b) => Math.abs(b.netFlowUsd) - Math.abs(a.netFlowUsd))
      .slice(0, limit);

    console.log(`✓ Fetched ${result.length} exchange flows`);
    return result;

  } catch (error) {
    console.error("Error fetching top exchanges:", error);
    return [];
  }
}
