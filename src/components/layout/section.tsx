import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

/**
 * Content section wrapper
 * Provides consistent spacing between dashboard sections
 */
export function Section({ children, className = "", title, description }: SectionProps) {
  return (
    <section className={`space-y-lg ${className}`}>
      {(title || description) && (
        <div className="space-y-xs">
          {title && (
            <h2 className="text-foreground text-xl font-semibold">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-foreground-muted text-sm">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
