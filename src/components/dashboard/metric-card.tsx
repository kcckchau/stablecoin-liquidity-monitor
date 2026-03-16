interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changeLabel?: string;
  sentiment?: "positive" | "negative" | "neutral";
}

export function MetricCard({ label, value, change, changeLabel, sentiment = "neutral" }: MetricCardProps) {
  const sentimentStyles = {
    positive: {
      border: "border-l-positive",
      text: "text-positive",
      bg: "bg-positive/5",
    },
    negative: {
      border: "border-l-negative",
      text: "text-negative",
      bg: "bg-negative/5",
    },
    neutral: {
      border: "border-l-border-subtle",
      text: "text-foreground-muted",
      bg: "bg-transparent",
    },
  };

  const styles = sentimentStyles[sentiment];

  return (
    <div className={`group relative overflow-hidden rounded-xl border border-border/40 ${styles.bg} bg-surface p-lg transition-all hover:border-border/60 hover:shadow-lg hover:shadow-black/5 ${styles.border} border-l-2`}>
      <div className="flex flex-col gap-sm">
        <span className="text-sm font-medium text-foreground-muted">{label}</span>
        <div className="text-3xl font-bold metric-value text-foreground">{value}</div>
        {change && (
          <div className="flex items-center gap-xs">
            <span className={`text-sm font-semibold ${styles.text}`}>
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
