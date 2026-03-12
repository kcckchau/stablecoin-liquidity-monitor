import { ExchangeFlowResponse } from "../data-sources/exchange-flows";
import { ExchangeFlowData } from "@/types/market-data";

/**
 * Normalize exchange flow data from various sources
 */

export function normalizeExchangeFlowData(
  rawData: ExchangeFlowResponse[],
  source: string = "cryptoquant"
): ExchangeFlowData[] {
  const normalized: ExchangeFlowData[] = [];

  for (const item of rawData) {
    // Create inflow entry
    if (item.inflow > 0) {
      normalized.push({
        id: `${item.exchange}-${item.token}-inflow-${item.timestamp.getTime()}`,
        exchange: item.exchange,
        token: item.token,
        flowType: "inflow",
        amount: item.inflow,
        amountUsd: item.inflow, // Assuming stablecoins are ~$1
        timestamp: item.timestamp,
        source,
      });
    }

    // Create outflow entry
    if (item.outflow > 0) {
      normalized.push({
        id: `${item.exchange}-${item.token}-outflow-${item.timestamp.getTime()}`,
        exchange: item.exchange,
        token: item.token,
        flowType: "outflow",
        amount: item.outflow,
        amountUsd: item.outflow,
        timestamp: item.timestamp,
        source,
      });
    }
  }

  return normalized;
}

export function calculateNetFlow(data: ExchangeFlowData[]): number {
  let netFlow = 0;

  for (const item of data) {
    if (item.flowType === "inflow") {
      netFlow += item.amountUsd;
    } else {
      netFlow -= item.amountUsd;
    }
  }

  return netFlow;
}

export function aggregateFlowsByExchange(data: ExchangeFlowData[]): Map<string, number> {
  const aggregated = new Map<string, number>();

  for (const item of data) {
    const current = aggregated.get(item.exchange) || 0;
    const amount = item.flowType === "inflow" ? item.amountUsd : -item.amountUsd;
    aggregated.set(item.exchange, current + amount);
  }

  return aggregated;
}

export function filterByTimeWindow(
  data: ExchangeFlowData[],
  startDate: Date,
  endDate: Date = new Date()
): ExchangeFlowData[] {
  return data.filter(
    (item) => item.timestamp >= startDate && item.timestamp <= endDate
  );
}
