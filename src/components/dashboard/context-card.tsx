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
    <div className="rounded-lg border border-border bg-surface p-lg">
      <div className="mb-md">
        <h3 className="mb-xs text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>

      <div className="space-y-md">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-xs">
              <span className="text-sm text-foreground-muted">{item.label}</span>
              {item.indicator && (
                <div className="h-1.5 w-1.5 rounded-full bg-foreground-subtle"></div>
              )}
            </div>
            <span className="text-sm font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
