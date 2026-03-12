import { RegimeType } from "@/types/regime";

// Regime classification thresholds
export const REGIME_THRESHOLDS = {
  EXPANSION_SCORE: 0.6,
  CONTRACTION_SCORE: -0.6,
} as const;

// Regime descriptions for UI
export const REGIME_DESCRIPTIONS: Record<RegimeType, string> = {
  expansion: "Liquidity is expanding - stablecoin supply increasing and net inflows to exchanges",
  contraction: "Liquidity is contracting - stablecoin supply decreasing and net outflows from exchanges",
  neutral: "Liquidity is stable - no significant directional movement",
  unknown: "Insufficient data to determine regime",
};

// Regime colors for UI
export const REGIME_COLORS: Record<RegimeType, string> = {
  expansion: "green",
  contraction: "red",
  neutral: "yellow",
  unknown: "gray",
};

// Time windows for analysis
export const TIME_WINDOWS = {
  SHORT: 7, // days
  MEDIUM: 30, // days
  LONG: 90, // days
} as const;

// Major stablecoins to track
export const MAJOR_STABLECOINS = [
  "USDT",
  "USDC",
  "DAI",
  "BUSD",
  "FRAX",
  "TUSD",
  "USDD",
  "USDP",
] as const;

// Major exchanges to track
export const MAJOR_EXCHANGES = [
  "binance",
  "coinbase",
  "kraken",
  "okx",
  "bybit",
  "bitfinex",
] as const;
