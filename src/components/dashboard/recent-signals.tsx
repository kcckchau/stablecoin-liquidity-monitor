interface SignalItem {
  text: string;
  time: string;
  sentiment: "positive" | "negative" | "neutral";
}

interface RecentSignalsProps {
  title: string;
  description: string;
  signals: SignalItem[];
}

export function RecentSignals({ title, description, signals }: RecentSignalsProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-surface p-lg shadow-lg shadow-black/5">
      <div className="mb-md">
        <h3 className="mb-xs text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>

      <div className="space-y-sm">
        {signals.map((signal, index) => {
          const sentimentStyles = {
            positive: "border-positive/30 bg-positive-surface",
            negative: "border-negative/30 bg-negative-surface",
            neutral: "border-border/30 bg-surface-muted",
          };

          const dotStyles = {
            positive: "bg-positive shadow-positive/50",
            negative: "bg-negative shadow-negative/50",
            neutral: "bg-foreground-subtle",
          };

          return (
            <div
              key={index}
              className={`group flex items-center justify-between rounded-lg border px-md py-sm transition-all hover:border-opacity-60 ${sentimentStyles[signal.sentiment]}`}
            >
              <div className="flex items-center gap-sm">
                <div className={`h-2 w-2 shrink-0 rounded-full shadow-sm ${dotStyles[signal.sentiment]}`}></div>
                <span className="text-sm leading-relaxed text-foreground">{signal.text}</span>
              </div>
              <span className="ml-md shrink-0 text-xs font-medium tabular-nums text-foreground-subtle">{signal.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
