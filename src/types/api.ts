import { RegimeData, RegimeSignal } from "./regime";
import { AggregatedSupply, AggregatedFlow } from "./market-data";

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  success: boolean;
  error?: string;
}

export interface OverviewResponse {
  totalStablecoinSupply: number;
  supplyChange24h: number;
  supplyChange7d: number;
  topStablecoins: AggregatedSupply[];
  netExchangeFlow24h: number;
  netExchangeFlow7d: number;
  topExchanges: AggregatedFlow[];
}

export interface RegimeResponse {
  current: RegimeData;
  signals: RegimeSignal[];
  lastUpdate: string;
}

export interface HistoryResponse {
  regimeHistory: {
    timestamp: string;
    regime: string;
    score: number;
  }[];
  supplyHistory: {
    timestamp: string;
    totalSupply: number;
  }[];
  flowHistory: {
    timestamp: string;
    netFlow: number;
  }[];
}
