interface ContextItem {
  label: string;
  value: string;
  indicator?: string;
}

interface ContextCardProps {
  title: string;
  description: string;
  items: ContextItem[];
}

export function ContextCard({ title, description, items }: ContextCardProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-surface p-lg shadow-lg shadow-black/5">
      <div className="mb-md">
        <h3 className="mb-xs text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>

      <div className="space-y-md">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg border border-border/20 bg-surface-muted/30 px-md py-sm">
            <div className="flex items-center gap-xs">
              <span className="text-sm font-medium text-foreground-muted">{item.label}</span>
              {item.indicator && (
                <div className="h-1.5 w-1.5 rounded-full bg-accent shadow-sm shadow-accent/50"></div>
              )}
            </div>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
