"use client";

import { HistoryResponse } from "@/types/api";

interface LiquidityChartProps {
  data?: HistoryResponse;
}

export function LiquidityChart({ data }: LiquidityChartProps) {
  // TODO: Implement actual chart using a library like Recharts or Chart.js
  // For now, return a placeholder

  return (
    <div className="w-full h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-2xl mb-2">📈</div>
        <p className="text-gray-600 font-medium">Liquidity Chart Placeholder</p>
        <p className="text-sm text-gray-500 mt-2">
          Will display regime history, supply trends, and flow data
        </p>
        {data && (
          <p className="text-xs text-gray-400 mt-2">
            Data points: Regime ({data.regimeHistory.length}), Supply (
            {data.supplyHistory.length}), Flow ({data.flowHistory.length})
          </p>
        )}
      </div>
    </div>
  );
}
