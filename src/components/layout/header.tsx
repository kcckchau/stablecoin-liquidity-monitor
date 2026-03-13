import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  lastUpdated?: string;
}

/**
 * Page header component
 * Displays page title, subtitle, and optional action controls
 */
export function Header({ title, subtitle, actions, lastUpdated }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between gap-lg py-lg px-xl">
        {/* Title section */}
        <div className="flex flex-col gap-sm min-w-0">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-foreground-muted text-base">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions and metadata */}
        <div className="flex items-center gap-md shrink-0">
          {lastUpdated && (
            <div className="hidden lg:flex flex-col items-end gap-xs">
              <span className="text-foreground-subtle text-xs uppercase tracking-wide">Last updated</span>
              <span className="text-foreground-muted text-sm font-medium tabular-nums">
                {lastUpdated}
              </span>
            </div>
          )}
          {actions}
        </div>
      </div>
    </header>
  );
}
