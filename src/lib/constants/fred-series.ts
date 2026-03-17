/**
 * FRED (Federal Reserve Economic Data) Series Configuration
 * 
 * Defines the economic series IDs used for macro liquidity analysis.
 * Each series represents a key component of the liquidity regime framework.
 * 
 * @see https://fred.stlouisfed.org/docs/api/fred/
 */

/**
 * Supported FRED series IDs
 */
export const FRED_SERIES = {
  /**
   * Overnight Reverse Repurchase Agreements: Treasury Securities Sold by the Federal Reserve
   * 
   * Series ID: RRPONTSYD
   * Frequency: Daily
   * Units: Billions of Dollars
   * 
   * Description: Amount of liquidity absorbed by the Fed through reverse repo operations.
   * Higher RRP indicates excess liquidity in the system being parked at the Fed.
   * 
   * Liquidity Signal: High RRP = High liquidity (potential risk-on)
   */
  RRP: "RRPONTSYD",

  /**
   * Treasury General Account (TGA) Balance
   * 
   * Series ID: WTREGEN
   * Frequency: Daily/Weekly
   * Units: Millions of Dollars
   * 
   * Description: Cash balance held by the U.S. Treasury at the Federal Reserve.
   * When TGA rises, liquidity is drained from the system. When it falls, liquidity is injected.
   * 
   * Liquidity Signal: Rising TGA = Liquidity drain (potential risk-off)
   */
  TGA: "WTREGEN",
} as const;

/**
 * Type-safe series ID union
 */
export type FredSeriesId = typeof FRED_SERIES[keyof typeof FRED_SERIES];

/**
 * Metadata for each FRED series
 */
export interface FredSeriesMetadata {
  id: FredSeriesId;
  name: string;
  description: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  units: string;
  liquiditySignal: "positive" | "negative";
  liquidityDirection: string;
}

/**
 * Complete metadata catalog for all series
 */
export const FRED_SERIES_METADATA: Record<keyof typeof FRED_SERIES, FredSeriesMetadata> = {
  RRP: {
    id: FRED_SERIES.RRP,
    name: "Overnight Reverse Repo",
    description: "Treasury securities sold by Federal Reserve in reverse repo operations",
    frequency: "Daily",
    units: "Billions of Dollars",
    liquiditySignal: "positive",
    liquidityDirection: "High RRP = High liquidity (risk-on)",
  },
  TGA: {
    id: FRED_SERIES.TGA,
    name: "Treasury General Account",
    description: "U.S. Treasury cash balance at the Federal Reserve",
    frequency: "Weekly",
    units: "Millions of Dollars",
    liquiditySignal: "negative",
    liquidityDirection: "Rising TGA = Liquidity drain (risk-off)",
  },
};

/**
 * Get metadata for a specific series
 */
export function getFredSeriesMetadata(seriesId: FredSeriesId): FredSeriesMetadata | undefined {
  const entry = Object.entries(FRED_SERIES).find(([_, id]) => id === seriesId);
  if (!entry) return undefined;
  
  const [key] = entry;
  return FRED_SERIES_METADATA[key as keyof typeof FRED_SERIES];
}

/**
 * Get all series IDs as an array
 */
export function getAllFredSeriesIds(): FredSeriesId[] {
  return Object.values(FRED_SERIES);
}

/**
 * Validate if a string is a known FRED series ID
 */
export function isValidFredSeriesId(value: string): value is FredSeriesId {
  return Object.values(FRED_SERIES).includes(value as FredSeriesId);
}
