"use client";

import { RegimeSignal } from "@/types/regime";

interface SignalSummaryProps {
  signals: RegimeSignal[];
}

export function SignalSummary({ signals }: SignalSummaryProps) {
  if (!signals || signals.length === 0) {
    return (
      <div className="border border-border rounded-lg p-lg bg-surface">
        <h3 className="text-lg font-semibold text-foreground mb-md">Market Signals</h3>
        <p className="text-foreground-subtle">No signals available</p>
      </div>
    );
  }

  const getSignalColor = (type: RegimeSignal["type"]) => {
    switch (type) {
      case "bullish":
        return "text-positive bg-positive-surface border-positive";
      case "bearish":
        return "text-negative bg-negative-surface border-negative";
      case "neutral":
        return "text-foreground bg-surface-muted border-border";
      default:
        return "text-foreground bg-surface-muted border-border";
    }
  };

  const getStrengthBadge = (strength: RegimeSignal["strength"]) => {
    const baseClasses = "px-sm py-xs text-xs font-medium rounded";
    switch (strength) {
      case "strong":
        return `${baseClasses} bg-accent-surface text-accent`;
      case "moderate":
        return `${baseClasses} bg-accent-surface text-accent`;
      case "weak":
        return `${baseClasses} bg-surface-muted text-foreground-muted`;
      default:
        return `${baseClasses} bg-surface-muted text-foreground-muted`;
    }
  };

  return (
    <div className="border border-border rounded-lg p-lg bg-surface">
      <h3 className="text-lg font-semibold text-foreground mb-md">Market Signals</h3>
      
      <div className="space-y-sm">
        {signals.map((signal, index) => (
          <div
            key={index}
            className={`border rounded-md p-md ${getSignalColor(signal.type)}`}
          >
            <div className="flex items-start justify-between mb-sm">
              <span className="font-medium capitalize">{signal.type}</span>
              <span className={getStrengthBadge(signal.strength)}>
                {signal.strength}
              </span>
            </div>
            <p className="text-sm">{signal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
