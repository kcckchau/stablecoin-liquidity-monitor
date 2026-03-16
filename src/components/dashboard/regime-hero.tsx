interface RegimeHeroProps {
  regime: string;
  score: number;
  change: string;
  description: string;
  signals: {
    label: string;
    value: string;
    sentiment: "positive" | "negative" | "neutral";
  }[];
}

export function RegimeHero({ regime, score, change, description, signals }: RegimeHeroProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-surface p-xl shadow-lg shadow-black/5">
      <div className="mb-lg">
        <div className="mb-sm flex items-center gap-md">
          <span className="text-sm font-medium uppercase tracking-wide text-foreground-subtle">Liquidity Regime</span>
          <div className="flex items-center gap-sm rounded-full bg-positive-surface px-md py-xs border border-positive/20">
            <div className="h-2 w-2 rounded-full bg-positive animate-pulse"></div>
            <span className="text-sm font-bold text-positive">{regime}</span>
          </div>
        </div>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>

      <div className="mb-lg">
        <div className="mb-md flex items-baseline gap-sm">
          <span className="metric-value text-6xl font-bold text-foreground">{score}</span>
          <span className="text-base font-semibold text-positive">{change}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-muted shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-positive to-positive/80 transition-all duration-500 shadow-sm"
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-3">
        {signals.map((signal) => {
          const sentimentStyles = {
            positive: "text-positive bg-positive/5 border-positive/20",
            negative: "text-negative bg-negative/5 border-negative/20",
            neutral: "text-foreground-muted bg-surface-muted border-border/20",
          };

          return (
            <div key={signal.label} className={`rounded-lg border px-md py-sm ${sentimentStyles[signal.sentiment]}`}>
              <div className="mb-xs text-xs font-medium uppercase tracking-wide text-foreground-subtle">{signal.label}</div>
              <div className="text-sm font-semibold">{signal.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
