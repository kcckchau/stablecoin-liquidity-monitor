"use client";

import { RegimeSignal } from "@/types/regime";

interface SignalSummaryProps {
  signals: RegimeSignal[];
}

export function SignalSummary({ signals }: SignalSummaryProps) {
  if (!signals || signals.length === 0) {
    return (
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Market Signals</h3>
        <p className="text-gray-500">No signals available</p>
      </div>
    );
  }

  const getSignalColor = (type: RegimeSignal["type"]) => {
    switch (type) {
      case "bullish":
        return "text-green-700 bg-green-50 border-green-200";
      case "bearish":
        return "text-red-700 bg-red-50 border-red-200";
      case "neutral":
        return "text-gray-700 bg-gray-50 border-gray-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStrengthBadge = (strength: RegimeSignal["strength"]) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded";
    switch (strength) {
      case "strong":
        return `${baseClasses} bg-purple-100 text-purple-700`;
      case "moderate":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case "weak":
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Market Signals</h3>
      
      <div className="space-y-3">
        {signals.map((signal, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getSignalColor(signal.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
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
