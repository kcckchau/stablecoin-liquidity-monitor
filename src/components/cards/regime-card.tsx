"use client";

import { RegimeData } from "@/types/regime";
import { REGIME_COLORS, REGIME_DESCRIPTIONS } from "@/lib/constants/regime";

interface RegimeCardProps {
  regime?: RegimeData;
}

export function RegimeCard({ regime }: RegimeCardProps) {
  if (!regime) {
    return (
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Current Regime</h3>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const colorClass = {
    green: "text-green-600 bg-green-100",
    red: "text-red-600 bg-red-100",
    yellow: "text-yellow-600 bg-yellow-100",
    gray: "text-gray-600 bg-gray-100",
  }[REGIME_COLORS[regime.regime]];

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Current Regime</h3>
      
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass} mb-4`}>
        {regime.regime.toUpperCase()}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Score</p>
          <p className="text-2xl font-bold">{regime.score.toFixed(4)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Confidence</p>
          <p className="text-lg font-semibold">{(regime.confidence * 100).toFixed(1)}%</p>
        </div>

        <div className="pt-3 border-t">
          <p className="text-sm text-gray-600 mb-1">Supply Trend</p>
          <p className="font-medium">{regime.supplyTrend}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Flow Trend</p>
          <p className="font-medium">{regime.flowTrend.replace("_", " ")}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Volatility</p>
          <p className="font-medium">{(regime.volatility * 100).toFixed(2)}%</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-700">{REGIME_DESCRIPTIONS[regime.regime]}</p>
      </div>
    </div>
  );
}
