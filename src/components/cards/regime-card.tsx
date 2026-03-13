"use client";

import { RegimeData } from "@/types/regime";
import { REGIME_COLORS, REGIME_DESCRIPTIONS } from "@/lib/constants/regime";

interface RegimeCardProps {
  regime?: RegimeData;
}

export function RegimeCard({ regime }: RegimeCardProps) {
  if (!regime) {
    return (
      <div className="border border-border rounded-lg p-lg bg-surface">
        <h3 className="text-lg font-semibold text-foreground mb-md">Current Regime</h3>
        <div className="text-foreground-subtle">Loading...</div>
      </div>
    );
  }

  // Map regime colors to semantic tokens
  const colorClass = {
    green: "text-positive bg-positive-surface",
    red: "text-negative bg-negative-surface",
    yellow: "text-warning bg-warning-surface",
    gray: "text-foreground-muted bg-surface-muted",
  }[REGIME_COLORS[regime.regime]];

  return (
    <div className="border border-border rounded-lg p-lg bg-surface">
      <h3 className="text-lg font-semibold text-foreground mb-md">Current Regime</h3>
      
      <div className={`inline-flex items-center px-md py-xs rounded-full text-sm font-medium ${colorClass} mb-md`}>
        {regime.regime.toUpperCase()}
      </div>

      <div className="space-y-sm">
        <div>
          <p className="text-sm text-foreground-muted">Score</p>
          <p className="text-2xl font-bold metric-value text-foreground">{regime.score.toFixed(4)}</p>
        </div>

        <div>
          <p className="text-sm text-foreground-muted">Confidence</p>
          <p className="text-lg font-semibold text-foreground">{(regime.confidence * 100).toFixed(1)}%</p>
        </div>

        <div className="pt-sm border-t border-border">
          <p className="text-sm text-foreground-muted mb-xs">Supply Trend</p>
          <p className="font-medium text-foreground">{regime.supplyTrend}</p>
        </div>

        <div>
          <p className="text-sm text-foreground-muted mb-xs">Flow Trend</p>
          <p className="font-medium text-foreground">{regime.flowTrend.replace("_", " ")}</p>
        </div>

        <div>
          <p className="text-sm text-foreground-muted mb-xs">Volatility</p>
          <p className="font-medium text-foreground">{(regime.volatility * 100).toFixed(2)}%</p>
        </div>
      </div>

      <div className="mt-md pt-md border-t border-border">
        <p className="text-sm text-foreground">{REGIME_DESCRIPTIONS[regime.regime]}</p>
      </div>
    </div>
  );
}
