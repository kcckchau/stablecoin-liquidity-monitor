interface ChartPanelProps {
  title: string;
  description: string;
  timeframes?: string[];
}

export function ChartPanel({ title, description, timeframes }: ChartPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-lg">
      <div className="mb-md flex items-start justify-between">
        <div>
          <h3 className="mb-xs text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-foreground-muted">{description}</p>
        </div>
        {timeframes && (
          <div className="flex gap-xs">
            {timeframes.map((tf) => (
              <button
                key={tf}
                className="rounded-md border border-border bg-surface-muted px-sm py-xs text-xs font-medium text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                {tf}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex h-64 items-center justify-center rounded-md bg-surface-muted">
        <span className="text-sm text-foreground-subtle">Chart placeholder</span>
      </div>
    </div>
  );
}
