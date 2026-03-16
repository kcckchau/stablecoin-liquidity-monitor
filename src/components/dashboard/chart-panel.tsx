import { ReactNode } from "react";

interface ChartPanelProps {
  title: string;
  description: string;
  timeframes?: string[];
  children?: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string;
}

export function ChartPanel({ 
  title, 
  description, 
  timeframes, 
  children,
  isLoading = false,
  isEmpty = false,
  error
}: ChartPanelProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-surface p-lg shadow-lg shadow-black/5">
      <div className="mb-md flex items-start justify-between">
        <div>
          <h3 className="mb-xs text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-foreground-muted">{description}</p>
        </div>
        {timeframes && !error && (
          <div className="flex gap-xs">
            {timeframes.map((tf, index) => (
              <button
                key={tf}
                disabled={isLoading}
                className={`rounded-lg border px-sm py-xs text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  index === 0
                    ? "border-accent/30 bg-accent/10 text-accent shadow-sm"
                    : "border-border/30 bg-surface-muted text-foreground-muted hover:border-border/50 hover:bg-surface-muted/60 hover:text-foreground"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex h-64 items-center justify-center rounded-lg border border-border/20 bg-surface-muted/50 shadow-inner">
        {isLoading ? (
          <div className="flex flex-col items-center gap-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"></div>
            <span className="text-sm font-medium text-foreground-subtle">Loading data...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-sm px-lg text-center">
            <svg className="h-8 w-8 text-negative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-negative">Error loading chart</p>
              <p className="mt-xs text-xs text-foreground-subtle">{error}</p>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center gap-sm">
            <svg className="h-8 w-8 text-foreground-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium text-foreground-subtle">No data available</span>
          </div>
        ) : children ? (
          children
        ) : (
          <span className="text-sm font-medium text-foreground-subtle">Chart placeholder</span>
        )}
      </div>
    </div>
  );
}
