export type RegimeType = "expansion" | "contraction" | "neutral" | "unknown";

export type TrendType = "increasing" | "decreasing" | "stable";

export type FlowTrendType = "net_inflow" | "net_outflow" | "neutral";

export interface RegimeData {
  regime: RegimeType;
  score: number;
  supplyTrend: TrendType;
  flowTrend: FlowTrendType;
  volatility: number;
  confidence: number;
  timestamp: Date;
}

export interface RegimeSignal {
  type: "bullish" | "bearish" | "neutral";
  strength: "strong" | "moderate" | "weak";
  description: string;
}

export interface RegimeMetrics {
  supplyChange7d: number;
  supplyChange30d: number;
  netFlow7d: number;
  netFlow30d: number;
  volatility7d: number;
}
