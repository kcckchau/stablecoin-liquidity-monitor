import "server-only";

import { RegimeData, RegimeType, TrendType, FlowTrendType, RegimeSignal } from "@/types/regime";
import { REGIME_THRESHOLDS } from "../constants/regime";
import {
  calculateSupplyScore,
  calculateFlowScore,
  calculateVolatilityScore,
  calculateMomentumScore,
  calculateCompositeScore,
  calculateConfidence,
} from "./scoring";

/**
 * Core regime computation engine
 * IMPORTANT: This module must remain server-side only
 */

export interface RegimeInputData {
  supplyChange7d: number;
  supplyChange30d: number;
  netFlow7d: number;
  netFlow30d: number;
  volatility7d: number;
  historicalScores?: number[];
}

export async function computeLiquidityRegime(
  input: RegimeInputData
): Promise<RegimeData> {
  // TODO: Implement full regime computation logic

  // Calculate component scores
  const supplyScore = calculateSupplyScore(input.supplyChange7d, input.supplyChange30d);
  const flowScore = calculateFlowScore(input.netFlow7d, input.netFlow30d);
  const volatilityScore = calculateVolatilityScore(input.volatility7d);
  const momentumScore = calculateMomentumScore(input.historicalScores || []);

  // Calculate composite score
  const compositeScore = calculateCompositeScore({
    supplyScore,
    flowScore,
    volatilityScore,
    momentumScore,
  });

  // Classify regime
  const regime = classifyRegime(compositeScore);

  // Determine trends
  const supplyTrend = determineTrend(input.supplyChange7d);
  const flowTrend = determineFlowTrend(input.netFlow7d);

  // Calculate confidence
  const confidence = calculateConfidence(30, 0.8); // TODO: Use real data points and consistency

  return {
    regime,
    score: compositeScore,
    supplyTrend,
    flowTrend,
    volatility: input.volatility7d,
    confidence,
    timestamp: new Date(),
  };
}

function classifyRegime(score: number): RegimeType {
  if (score >= REGIME_THRESHOLDS.EXPANSION_SCORE) {
    return "expansion";
  }
  if (score <= REGIME_THRESHOLDS.CONTRACTION_SCORE) {
    return "contraction";
  }
  return "neutral";
}

function determineTrend(changePercent: number): TrendType {
  if (changePercent > 1.0) return "increasing";
  if (changePercent < -1.0) return "decreasing";
  return "stable";
}

function determineFlowTrend(netFlow: number): FlowTrendType {
  const threshold = 100000000; // $100M
  if (netFlow > threshold) return "net_inflow";
  if (netFlow < -threshold) return "net_outflow";
  return "neutral";
}

export function generateRegimeSignals(regime: RegimeData): RegimeSignal[] {
  // TODO: Implement signal generation based on regime
  const signals: RegimeSignal[] = [];

  if (regime.regime === "expansion" && regime.confidence > 0.7) {
    signals.push({
      type: "bullish",
      strength: "strong",
      description: "Strong liquidity expansion detected with high confidence",
    });
  }

  if (regime.regime === "contraction" && regime.confidence > 0.7) {
    signals.push({
      type: "bearish",
      strength: "strong",
      description: "Strong liquidity contraction detected with high confidence",
    });
  }

  if (regime.supplyTrend === "increasing" && regime.flowTrend === "net_inflow") {
    signals.push({
      type: "bullish",
      strength: "moderate",
      description: "Both supply and exchange inflows increasing",
    });
  }

  if (regime.volatility > 0.05) {
    signals.push({
      type: "neutral",
      strength: "weak",
      description: "High volatility indicates market uncertainty",
    });
  }

  return signals;
}
