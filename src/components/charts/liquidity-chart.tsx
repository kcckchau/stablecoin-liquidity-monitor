"use client";

import { HistoryResponse } from "@/types/api";

interface LiquidityChartProps {
  data?: HistoryResponse;
}

export function LiquidityChart({ data }: LiquidityChartProps) {
  // TODO: Implement actual chart using a library like Recharts or Chart.js
  // For now, return a placeholder

  return (
    <div className="w-full h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-surface-muted">
      <div className="text-center">
        <div className="text-2xl mb-2">📈</div>
        <p className="text-foreground-muted font-medium">Liquidity Chart Placeholder</p>
        <p className="text-sm text-foreground-subtle mt-2">
          Will display regime history, supply trends, and flow data
        </p>
        {data && (
          <p className="text-xs text-foreground-subtle mt-2">
            Data points: Regime ({data.regimeHistory.length}), Supply (
            {data.supplyHistory.length}), Flow ({data.flowHistory.length})
          </p>
        )}
      </div>
    </div>
  );
}
