interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeLabel?: string;
  sentiment?: "positive" | "negative" | "neutral";
}

export function MetricCard({ label, value, change, changeLabel, sentiment = "neutral" }: MetricCardProps) {
  const sentimentColors = {
    positive: "text-positive",
    negative: "text-negative",
    neutral: "text-foreground-muted",
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-lg">
      <div className="flex flex-col gap-sm">
        <span className="text-sm text-foreground-muted">{label}</span>
        <div className="text-3xl font-bold metric-value text-foreground">{value}</div>
        {change && (
          <div className="flex items-center gap-xs">
            <span className={`text-sm font-medium ${sentimentColors[sentiment]}`}>
              {change}
            </span>
            {changeLabel && (
              <span className="text-xs text-foreground-subtle">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
