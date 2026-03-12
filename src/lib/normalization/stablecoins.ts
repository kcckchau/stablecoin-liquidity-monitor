import { DefiLlamaStablecoinResponse } from "../data-sources/defillama";
import { StablecoinData } from "@/types/market-data";

/**
 * Normalize stablecoin data from various sources into a consistent format
 */

export function normalizeDefiLlamaData(
  rawData: DefiLlamaStablecoinResponse[],
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

export function aggregateStablecoinSupply(data: StablecoinData[]): number {
  return data.reduce((total, item) => total + item.supply, 0);
}

export function calculateSupplyChange(
  current: StablecoinData[],
  previous: StablecoinData[]
): number {
  const currentTotal = aggregateStablecoinSupply(current);
  const previousTotal = aggregateStablecoinSupply(previous);

  if (previousTotal === 0) return 0;
  return ((currentTotal - previousTotal) / previousTotal) * 100;
}

export function filterMajorStablecoins(
  data: StablecoinData[],
  majorSymbols: string[]
): StablecoinData[] {
  return data.filter((item) => majorSymbols.includes(item.symbol));
}
