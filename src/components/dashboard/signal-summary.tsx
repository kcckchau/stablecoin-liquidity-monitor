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
    <div className="rounded-lg border border-border bg-surface p-lg">
      <div className="mb-md">
        <h3 className="mb-xs text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>

      <div className="space-y-sm">
        {signals.map((signal, index) => (
          <div
            key={index}
            className="rounded-md border border-border bg-surface-muted px-md py-sm"
          >
            <span className="text-sm text-foreground">{signal.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
