"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useStablecoinHistory } from "@/hooks/use-stablecoin-history";

type TimeframeOption = "7D" | "30D" | "90D";

const timeframeToDays: Record<TimeframeOption, 7 | 30 | 90> = {
  "7D": 7,
  "30D": 30,
  "90D": 90,
};

export function StablecoinSupplyChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>("7D");
  
  // Fetch data using the hook
  const { data: rawData, isLoading, error } = useStablecoinHistory(timeframeToDays[selectedTimeframe]);

  // Format data for display
  const chartData = rawData.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    // Convert to billions for readability
    usdt: point.usdt / 1e9,
    usdc: point.usdc / 1e9,
    dai: point.dai / 1e9,
    total: point.total / 1e9,
  }));
  
  const isEmpty = !isLoading && chartData.length === 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border/40 bg-surface p-sm shadow-lg">
          <p className="text-xs font-semibold text-foreground mb-xs">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}B
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/40 bg-surface p-lg shadow-lg shadow-black/5">
        <div className="mb-md flex items-start justify-between">
          <div>
            <h3 className="mb-xs text-lg font-semibold text-foreground">Stablecoin Supply Trend</h3>
            <p className="text-sm text-foreground-muted">Aggregate and major-issuer supply expansion over time.</p>
          </div>
          <div className="flex gap-xs">
            {(["7D", "30D", "90D"] as const).map((range) => (
              <button
                key={range}
                disabled
                className={`rounded-lg border px-sm py-xs text-xs font-semibold transition-all opacity-50 cursor-not-allowed ${
                  selectedTimeframe === range
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-border/30 bg-surface-muted text-foreground-muted"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-64 items-center justify-center rounded-lg border border-border/20 bg-surface-muted/50 shadow-inner">
          <div className="flex flex-col items-center gap-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"></div>
            <span className="text-sm font-medium text-foreground-subtle">Loading chart data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="rounded-xl border border-border/40 bg-surface p-lg shadow-lg shadow-black/5">
        <div className="mb-md flex items-start justify-between">
          <div>
            <h3 className="mb-xs text-lg font-semibold text-foreground">Stablecoin Supply Trend</h3>
            <p className="text-sm text-foreground-muted">Aggregate and major-issuer supply expansion over time.</p>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center rounded-lg border border-border/20 bg-surface-muted/50 shadow-inner">
          <div className="flex flex-col items-center gap-sm px-lg text-center">
            <svg className="h-8 w-8 text-negative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-negative">Error loading chart</p>
              <p className="mt-xs text-xs text-foreground-subtle">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (isEmpty) {
    return (
      <div className="rounded-xl border border-border/40 bg-surface p-lg shadow-lg shadow-black/5">
        <div className="mb-md flex items-start justify-between">
          <div>
            <h3 className="mb-xs text-lg font-semibold text-foreground">Stablecoin Supply Trend</h3>
            <p className="text-sm text-foreground-muted">Aggregate and major-issuer supply expansion over time.</p>
          </div>
          <div className="flex gap-xs">
            {(["7D", "30D", "90D"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeframe(range)}
                className={`rounded-lg border px-sm py-xs text-xs font-semibold transition-all ${
                  selectedTimeframe === range
                    ? "border-accent/30 bg-accent/10 text-accent shadow-sm"
                    : "border-border/30 bg-surface-muted text-foreground-muted hover:border-border/50 hover:bg-surface-muted/60 hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-64 items-center justify-center rounded-lg border border-border/20 bg-surface-muted/50 shadow-inner">
          <div className="flex flex-col items-center gap-sm">
            <svg className="h-8 w-8 text-foreground-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium text-foreground-subtle">No data available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/40 bg-surface p-lg shadow-lg shadow-black/5">
      <div className="mb-md flex items-start justify-between">
        <div>
          <h3 className="mb-xs text-lg font-semibold text-foreground">Stablecoin Supply Trend</h3>
          <p className="text-sm text-foreground-muted">Aggregate and major-issuer supply expansion over time.</p>
        </div>
        <div className="flex gap-xs">
          {(["7D", "30D", "90D"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeframe(range)}
              disabled={isLoading}
              className={`rounded-lg border px-sm py-xs text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedTimeframe === range
                  ? "border-accent/30 bg-accent/10 text-accent shadow-sm"
                  : "border-border/30 bg-surface-muted text-foreground-muted hover:border-border/50 hover:bg-surface-muted/60 hover:text-foreground"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '12px' }}
              label={{ value: 'Supply ($B)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255,255,255,0.5)', fontSize: '12px' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={false}
              name="Total"
            />
            <Line 
              type="monotone" 
              dataKey="usdt" 
              stroke="#10b981" 
              strokeWidth={1.5}
              dot={false}
              name="USDT"
            />
            <Line 
              type="monotone" 
              dataKey="usdc" 
              stroke="#3b82f6" 
              strokeWidth={1.5}
              dot={false}
              name="USDC"
            />
            <Line 
              type="monotone" 
              dataKey="dai" 
              stroke="#f59e0b" 
              strokeWidth={1.5}
              dot={false}
              name="DAI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
