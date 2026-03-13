"use client";

import { formatCurrency, formatPercentage, abbreviateNumber } from "@/lib/utils/numbers";

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  format?: "currency" | "number" | "percentage";
  subtitle?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  format = "currency",
  subtitle 
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return formatCurrency(val, 0);
      case "percentage":
        return `${val.toFixed(2)}%`;
      case "number":
        return abbreviateNumber(val);
      default:
        return val.toString();
    }
  };

  return (
    <div className="border border-border rounded-lg p-lg bg-surface">
      <h4 className="text-sm font-medium text-foreground-muted mb-sm">{title}</h4>
      <p className="text-3xl font-bold metric-value text-foreground mb-sm">{formatValue(value)}</p>
      
      {change !== undefined && (
        <div className={`text-sm font-medium ${change >= 0 ? "text-positive" : "text-negative"}`}>
          {formatPercentage(change)} {subtitle || ""}
        </div>
      )}

      {subtitle && change === undefined && (
        <p className="text-sm text-foreground-subtle">{subtitle}</p>
      )}
    </div>
  );
}
