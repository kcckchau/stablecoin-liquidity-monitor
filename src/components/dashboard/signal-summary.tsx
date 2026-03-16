interface Signal {
  text: string;
}

interface SignalSummaryProps {
  title: string;
  description: string;
  signals: Signal[];
}

export function SignalSummary({ title, description, signals }: SignalSummaryProps) {
  return (
    <div className="h-full rounded-xl border border-border/40 bg-surface p-lg shadow-lg shadow-black/5">
      <div className="mb-md">
        <h3 className="mb-xs text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>

      <div className="space-y-sm">
        {signals.map((signal, index) => (
          <div
            key={index}
            className="group flex items-start gap-sm rounded-lg border border-border/30 bg-surface-muted px-md py-sm transition-colors hover:border-border/50 hover:bg-surface-muted/60"
          >
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></div>
            <span className="text-sm leading-relaxed text-foreground">{signal.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
