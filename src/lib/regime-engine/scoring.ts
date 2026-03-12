import "server-only";

/**
 * Scoring functions for regime calculation
 * IMPORTANT: This module must remain server-side only
 * Do not expose scoring weights or internal algorithms to the client
 */

// Internal weights - DO NOT EXPORT to client
const WEIGHTS = {
  SUPPLY_TREND: 0.35,
  FLOW_TREND: 0.30,
  VOLATILITY: 0.20,
  MOMENTUM: 0.15,
} as const;

export function calculateSupplyScore(
  supplyChange7d: number,
  supplyChange30d: number
): number {
  // TODO: Implement sophisticated supply scoring algorithm
  // Consider both short-term and long-term trends

  // Placeholder logic
  const shortTermScore = Math.tanh(supplyChange7d / 10); // Normalize between -1 and 1
  const longTermScore = Math.tanh(supplyChange30d / 20);

  return (shortTermScore * 0.6 + longTermScore * 0.4) * WEIGHTS.SUPPLY_TREND;
}

export function calculateFlowScore(netFlow7d: number, netFlow30d: number): number {
  // TODO: Implement flow scoring algorithm
  // Positive flows = bullish, negative = bearish

  // Placeholder logic
  const shortTermScore = Math.tanh(netFlow7d / 1000000000); // Normalize
  const longTermScore = Math.tanh(netFlow30d / 5000000000);

  return (shortTermScore * 0.6 + longTermScore * 0.4) * WEIGHTS.FLOW_TREND;
}

export function calculateVolatilityScore(volatility: number): number {
  // TODO: Implement volatility scoring
  // High volatility might indicate uncertainty

  // Placeholder logic - invert so lower volatility = more positive score
  const normalizedVol = Math.min(volatility * 100, 1);
  return (1 - normalizedVol) * WEIGHTS.VOLATILITY;
}

export function calculateMomentumScore(recentScores: number[]): number {
  // TODO: Implement momentum calculation
  // Look at trend of recent scores

  if (recentScores.length < 2) return 0;

  // Placeholder logic - simple linear regression slope
  const n = recentScores.length;
  const xMean = (n - 1) / 2;
  const yMean = recentScores.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (recentScores[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }

  const slope = numerator / denominator;
  return Math.tanh(slope) * WEIGHTS.MOMENTUM;
}

export function calculateCompositeScore(components: {
  supplyScore: number;
  flowScore: number;
  volatilityScore: number;
  momentumScore: number;
}): number {
  return (
    components.supplyScore +
    components.flowScore +
    components.volatilityScore +
    components.momentumScore
  );
}

export function calculateConfidence(
  dataPoints: number,
  consistency: number
): number {
  // TODO: Implement confidence calculation
  // More data points and more consistent signals = higher confidence

  // Placeholder
  const dataConfidence = Math.min(dataPoints / 100, 1);
  const consistencyConfidence = consistency;

  return (dataConfidence + consistencyConfidence) / 2;
}
