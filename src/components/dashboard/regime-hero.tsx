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
    <div className="rounded-lg border border-border bg-surface p-xl">
      <div className="mb-lg">
        <div className="mb-sm flex items-center gap-md">
          <span className="text-sm font-medium text-foreground-muted">Liquidity Regime</span>
          <div className="flex items-center gap-xs rounded-full bg-positive-surface px-md py-xs">
            <div className="h-2 w-2 rounded-full bg-positive"></div>
            <span className="text-sm font-medium text-positive">{regime}</span>
          </div>
        </div>
        <p className="text-foreground-muted">{description}</p>
      </div>

      <div className="mb-lg">
        <div className="mb-sm flex items-baseline gap-sm">
          <span className="metric-value text-6xl font-bold text-foreground">{score}</span>
          <span className="text-sm font-medium text-positive">{change}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full bg-positive transition-all"
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-3">
        {signals.map((signal) => {
          const sentimentColors = {
            positive: "text-positive",
            negative: "text-negative",
            neutral: "text-foreground-muted",
          };

          return (
            <div key={signal.label}>
              <div className="text-xs text-foreground-subtle">{signal.label}:</div>
              <div className={`text-sm font-medium ${sentimentColors[signal.sentiment]}`}>
                {signal.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
