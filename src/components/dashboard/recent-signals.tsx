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
    <div className="rounded-lg border border-border bg-surface p-lg">
      <div className="mb-md">
        <h3 className="mb-xs text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>

      <div className="space-y-sm">
        {signals.map((signal, index) => {
          const sentimentColors = {
            positive: "border-positive bg-positive-surface",
            negative: "border-negative bg-negative-surface",
            neutral: "border-border bg-surface-muted",
          };

          const dotColors = {
            positive: "bg-positive",
            negative: "bg-negative",
            neutral: "bg-foreground-subtle",
          };

          return (
            <div
              key={index}
              className={`flex items-center justify-between rounded-md border px-md py-sm ${sentimentColors[signal.sentiment]}`}
            >
              <div className="flex items-center gap-sm">
                <div className={`h-1.5 w-1.5 rounded-full ${dotColors[signal.sentiment]}`}></div>
                <span className="text-sm text-foreground">{signal.text}</span>
              </div>
              <span className="text-xs text-foreground-subtle">{signal.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
