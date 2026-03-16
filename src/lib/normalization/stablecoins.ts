import { StablecoinSupply } from "../data-sources/defillama";
import { StablecoinData, AggregatedSupply } from "@/types/market-data";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Normalize stablecoin data from various sources into a consistent format
 */

/**
 * Convert DefiLlama API response to internal StablecoinData format
 */
export function normalizeDefiLlamaData(
  rawData: StablecoinSupply[],
  source: string = "defillama"
): StablecoinData[] {
  return rawData.map((item) => ({
    id: item.id,
    symbol: item.symbol,
    name: item.name,
    supply: item.circulating,
    marketCap: item.circulating * item.price,
    timestamp: new Date(),
    source,
  }));
}

/**
 * Convert StablecoinData to Prisma-compatible format for database insertion
 */
export function toPrismaFormat(data: StablecoinData) {
  return {
    symbol: data.symbol,
    name: data.name,
    supply: new Decimal(data.supply),
    marketCap: new Decimal(data.marketCap),
    timestamp: data.timestamp,
    source: data.source,
  };
}

/**
 * Convert Prisma StablecoinSupply to internal StablecoinData format
 */
export function fromPrismaFormat(prismaData: {
  id: string;
  symbol: string;
  name: string;
  supply: Decimal;
  marketCap: Decimal;
  timestamp: Date;
  source: string;
}): StablecoinData {
  return {
    id: prismaData.id,
    symbol: prismaData.symbol,
    name: prismaData.name,
    supply: prismaData.supply.toNumber(),
    marketCap: prismaData.marketCap.toNumber(),
    timestamp: prismaData.timestamp,
    source: prismaData.source,
  };
}

/**
 * Calculate total supply across all stablecoins
 */
export function aggregateStablecoinSupply(data: StablecoinData[]): number {
  return data.reduce((total, item) => total + item.supply, 0);
}

/**
 * Calculate supply change percentage between two datasets
 */
export function calculateSupplyChange(
  current: StablecoinData[],
  previous: StablecoinData[]
): number {
  const currentTotal = aggregateStablecoinSupply(current);
  const previousTotal = aggregateStablecoinSupply(previous);

  if (previousTotal === 0) return 0;
  return ((currentTotal - previousTotal) / previousTotal) * 100;
}

/**
 * Calculate supply change for a specific stablecoin symbol
 */
export function calculateSymbolSupplyChange(
  symbol: string,
  current: StablecoinData[],
  previous: StablecoinData[]
): number {
  const currentItem = current.find(item => item.symbol === symbol);
  const previousItem = previous.find(item => item.symbol === symbol);

  if (!currentItem || !previousItem || previousItem.supply === 0) return 0;
  
  return ((currentItem.supply - previousItem.supply) / previousItem.supply) * 100;
}

/**
 * Filter for major stablecoins only
 */
export function filterMajorStablecoins(
  data: StablecoinData[],
  majorSymbols: string[] = ["USDT", "USDC", "DAI"]
): StablecoinData[] {
  return data.filter((item) => majorSymbols.includes(item.symbol));
}

/**
 * Aggregate stablecoin data by symbol with change calculations
 */
export function aggregateBySymbol(
  currentData: StablecoinData[],
  data24hAgo: StablecoinData[],
  data7dAgo: StablecoinData[]
): AggregatedSupply[] {
  const symbols = [...new Set(currentData.map(item => item.symbol))];

  return symbols.map(symbol => {
    const current = currentData.find(item => item.symbol === symbol);
    const prev24h = data24hAgo.find(item => item.symbol === symbol);
    const prev7d = data7dAgo.find(item => item.symbol === symbol);

    const changePercent24h = current && prev24h && prev24h.supply > 0
      ? ((current.supply - prev24h.supply) / prev24h.supply) * 100
      : 0;

    const changePercent7d = current && prev7d && prev7d.supply > 0
      ? ((current.supply - prev7d.supply) / prev7d.supply) * 100
      : 0;

    return {
      symbol,
      totalSupply: current?.supply || 0,
      totalMarketCap: current?.marketCap || 0,
      changePercent24h,
      changePercent7d,
      timestamp: current?.timestamp || new Date(),
    };
  });
}

/**
 * Format supply value for display (billions with 2 decimals)
 */
export function formatSupply(supply: number): string {
  const billions = supply / 1_000_000_000;
  return `$${billions.toFixed(2)}B`;
}

/**
 * Format change percentage for display
 */
export function formatChangePercent(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}
