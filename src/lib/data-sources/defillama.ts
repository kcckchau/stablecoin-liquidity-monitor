/**
 * DefiLlama API client for fetching stablecoin data
 * Documentation: https://defillama.com/docs/api
 * 
 * DefiLlama provides free public APIs for stablecoin data
 * No API key required for basic usage
 */

const DEFILLAMA_BASE_URL = "https://stablecoins.llama.fi";

// Response types from DefiLlama API
interface DefiLlamaStablecoin {
  id: string;
  name: string;
  symbol: string;
  gecko_id?: string;
  pegType?: string;
  priceSource?: string;
  pegMechanism?: string;
  circulating?: {
    peggedUSD?: number;
  };
  price?: number;
  chains?: string[];
}

interface DefiLlamaStablecoinsResponse {
  peggedAssets: DefiLlamaStablecoin[];
}

interface DefiLlamaChartPoint {
  date: number; // Unix timestamp
  totalCirculating: {
    peggedUSD: number;
  };
}

interface DefiLlamaChartResponse {
  [key: string]: DefiLlamaChartPoint[];
}

export interface StablecoinSupply {
  id: string;
  name: string;
  symbol: string;
  circulating: number; // Total supply in USD
  price: number;
  chains: string[];
}

/**
 * Fetch current stablecoin supplies from DefiLlama
 * Focuses on major stablecoins: USDT, USDC, DAI
 */
export async function fetchStablecoinSupplies(): Promise<StablecoinSupply[]> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/stablecoins?includePrices=true`, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status} ${response.statusText}`);
    }

    const data: DefiLlamaStablecoinsResponse = await response.json();

    // Filter for major stablecoins we care about
    const targetSymbols = ["USDT", "USDC", "DAI"];
    const stablecoins = data.peggedAssets
      .filter(coin => targetSymbols.includes(coin.symbol))
      .map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        circulating: coin.circulating?.peggedUSD || 0,
        price: coin.price || 1.0,
        chains: coin.chains || [],
      }));

    console.log(`✓ Fetched ${stablecoins.length} stablecoins from DefiLlama`);
    return stablecoins;

  } catch (error) {
    console.error("Error fetching stablecoin supplies from DefiLlama:", error);
    throw error;
  }
}

/**
 * Fetch historical supply data for a specific stablecoin
 * @param stablecoinId - DefiLlama stablecoin ID (e.g., "1" for USDT)
 * @param days - Number of days of history to fetch (default: 90)
 */
export async function fetchHistoricalSupply(
  stablecoinId: string,
  days: number = 90
): Promise<Array<{ timestamp: Date; supply: number }>> {
  try {
    const response = await fetch(`${DEFILLAMA_BASE_URL}/stablecoincharts/all?stablecoin=${stablecoinId}`, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status} ${response.statusText}`);
    }

    const data: DefiLlamaChartPoint[] = await response.json();

    // Convert to our internal format and filter by date range
    const cutoffDate = Date.now() / 1000 - (days * 24 * 60 * 60);
    const historicalData = data
      .filter(point => point.date >= cutoffDate)
      .map(point => ({
        timestamp: new Date(point.date * 1000),
        supply: point.totalCirculating.peggedUSD,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    console.log(`✓ Fetched ${historicalData.length} historical data points for stablecoin ${stablecoinId}`);
    return historicalData;

  } catch (error) {
    console.error(`Error fetching historical supply for stablecoin ${stablecoinId}:`, error);
    throw error;
  }
}

/**
 * Fetch historical supply for all major stablecoins
 * Returns aggregated data for USDT, USDC, DAI
 */
export async function fetchAllHistoricalSupplies(days: number = 90): Promise<Map<string, Array<{ timestamp: Date; supply: number }>>> {
  try {
    // DefiLlama stablecoin IDs (these are stable identifiers)
    const stablecoinIds = {
      "USDT": "1",
      "USDC": "2", 
      "DAI": "3",
    };

    const results = new Map<string, Array<{ timestamp: Date; supply: number }>>();

    // Fetch historical data for each stablecoin
    for (const [symbol, id] of Object.entries(stablecoinIds)) {
      try {
        const history = await fetchHistoricalSupply(id, days);
        results.set(symbol, history);
      } catch (error) {
        console.error(`Failed to fetch history for ${symbol}:`, error);
        // Continue with other stablecoins even if one fails
        results.set(symbol, []);
      }
    }

    return results;

  } catch (error) {
    console.error("Error fetching all historical supplies:", error);
    throw error;
  }
}
