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

    // Group by date (day granularity)
    const dailyMap = new Map<string, Map<string, number>>();

    supplies.forEach(record => {
      const dateKey = record.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, new Map());
      }
      
      const dayData = dailyMap.get(dateKey)!;
      const currentSupply = dayData.get(record.symbol) || 0;
      dayData.set(record.symbol, currentSupply + record.supply.toNumber());
    });

    // Convert to array format
    const history: SupplyHistoryPoint[] = [];
    dailyMap.forEach((symbolMap, dateKey) => {
      const totalSupply = Array.from(symbolMap.values()).reduce((sum, val) => sum + val, 0);
      const bySymbol: Record<string, number> = {};
      symbolMap.forEach((supply, symbol) => {
        bySymbol[symbol] = supply;
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
