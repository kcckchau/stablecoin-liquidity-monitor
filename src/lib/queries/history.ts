import { prisma } from "../db/prisma";
import { getDaysAgo } from "../utils/dates";

/**
 * Database queries for historical data
 */

export interface RegimeHistoryPoint {
  timestamp: string;
  regime: string;
  score: number;
}

export interface SupplyHistoryPoint {
  timestamp: string;
  totalSupply: number;
  bySymbol?: Record<string, number>;
}

export interface FlowHistoryPoint {
  timestamp: string;
  netFlow: number;
}

/**
 * Get historical regime data
 */
export async function getRegimeHistory(days: number = 30): Promise<RegimeHistoryPoint[]> {
  try {
    const startDate = getDaysAgo(days);

    const regimes = await prisma.liquidityRegime.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
      select: {
        timestamp: true,
        regime: true,
        score: true,
      },
    });

    const history = regimes.map(r => ({
      timestamp: r.timestamp.toISOString(),
      regime: r.regime,
      score: r.score.toNumber(),
    }));

    console.log(`✓ Fetched ${history.length} regime history points`);
    return history;

  } catch (error) {
    console.error("Error fetching regime history:", error);
    return [];
  }
}

/**
 * Get historical stablecoin supply data aggregated by day
 */
export async function getSupplyHistory(days: number = 30): Promise<SupplyHistoryPoint[]> {
  try {
    const startDate = getDaysAgo(days);

    // Get all stablecoin supply records in the time range
    const supplies = await prisma.stablecoinSupply.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
      select: {
        timestamp: true,
        symbol: true,
        supply: true,
      },
    });

    // Group by date (day granularity) - take LATEST record per symbol per day
    const dailyMap = new Map<string, Map<string, {supply: number, timestamp: Date}>>();

    supplies.forEach(record => {
      const dateKey = record.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, new Map());
      }
      
      const dayData = dailyMap.get(dateKey)!;
      const existing = dayData.get(record.symbol);
      
      // Only keep the latest record for each symbol per day
      if (!existing || record.timestamp > existing.timestamp) {
        dayData.set(record.symbol, {
          supply: record.supply.toNumber(),
          timestamp: record.timestamp
        });
      }
    });

    // Convert to array format
    const history: SupplyHistoryPoint[] = [];
    dailyMap.forEach((symbolMap, dateKey) => {
      const totalSupply = Array.from(symbolMap.values()).reduce((sum, item) => sum + item.supply, 0);
      const bySymbol: Record<string, number> = {};
      symbolMap.forEach((item, symbol) => {
        bySymbol[symbol] = item.supply;
      });

      history.push({
        timestamp: new Date(dateKey).toISOString(),
        totalSupply,
        bySymbol,
      });
    });

    // Sort by timestamp
    history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    console.log(`✓ Fetched ${history.length} supply history points`);
    return history;

  } catch (error) {
    console.error("Error fetching supply history:", error);
    return [];
  }
}

/**
 * Get historical exchange flow data aggregated by day
 */
export async function getFlowHistory(days: number = 30): Promise<FlowHistoryPoint[]> {
  try {
    const startDate = getDaysAgo(days);

    const flows = await prisma.exchangeFlow.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
      select: {
        timestamp: true,
        flowType: true,
        amountUsd: true,
      },
    });

    // Group by date (day granularity)
    const dailyMap = new Map<string, number>();

    flows.forEach(flow => {
      const dateKey = flow.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentFlow = dailyMap.get(dateKey) || 0;
      const amount = flow.amountUsd.toNumber();
      
      if (flow.flowType === 'inflow') {
        dailyMap.set(dateKey, currentFlow + amount);
      } else {
        dailyMap.set(dateKey, currentFlow - amount);
      }
    });

    // Convert to array format
    const history: FlowHistoryPoint[] = [];
    dailyMap.forEach((netFlow, dateKey) => {
      history.push({
        timestamp: new Date(dateKey).toISOString(),
        netFlow,
      });
    });

    // Sort by timestamp
    history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    console.log(`✓ Fetched ${history.length} flow history points`);
    return history;

  } catch (error) {
    console.error("Error fetching flow history:", error);
    return [];
  }
}

/**
 * Get stablecoin history with range parameter
 * Converts range string (7D, 30D, 90D) to days and returns formatted data for API
 */
export async function getStablecoinHistory(range: "7D" | "30D" | "90D") {
  const rangeToDays = {
    "7D": 7,
    "30D": 30,
    "90D": 90,
  };

  const days = rangeToDays[range];
  const supplyHistory = await getSupplyHistory(days);

  // Convert to API format
  const stablecoinSupplyTrend = supplyHistory.map(point => ({
    date: point.timestamp,
    usdt: point.bySymbol?.USDT || 0,
    usdc: point.bySymbol?.USDC || 0,
    dai: point.bySymbol?.DAI || 0,
    total: point.totalSupply,
  }));

  return {
    range,
    stablecoinSupplyTrend,
  };
}

/**
 * Get supply history for a specific stablecoin symbol
 */
export async function getSymbolSupplyHistory(symbol: string, days: number = 30): Promise<SupplyHistoryPoint[]> {
  try {
    const startDate = getDaysAgo(days);

    const supplies = await prisma.stablecoinSupply.findMany({
      where: {
        symbol,
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
      select: {
        timestamp: true,
        supply: true,
      },
    });

    const history = supplies.map(s => ({
      timestamp: s.timestamp.toISOString(),
      totalSupply: s.supply.toNumber(),
    }));

    console.log(`✓ Fetched ${history.length} history points for ${symbol}`);
    return history;

  } catch (error) {
    console.error(`Error fetching supply history for ${symbol}:`, error);
    return [];
  }
}
