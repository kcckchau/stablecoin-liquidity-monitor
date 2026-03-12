export interface StablecoinData {
  id: string;
  symbol: string;
  name: string;
  supply: number;
  marketCap: number;
  timestamp: Date;
  source: string;
}

export interface ExchangeFlowData {
  id: string;
  exchange: string;
  token: string;
  flowType: "inflow" | "outflow";
  amount: number;
  amountUsd: number;
  timestamp: Date;
  source: string;
}

export interface AggregatedSupply {
  symbol: string;
  totalSupply: number;
  totalMarketCap: number;
  changePercent24h: number;
  changePercent7d: number;
  timestamp: Date;
}

export interface AggregatedFlow {
  exchange: string;
  token: string;
  netFlow: number;
  netFlowUsd: number;
  inflowTotal: number;
  outflowTotal: number;
  timestamp: Date;
}
