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
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      <p className="text-3xl font-bold mb-2">{formatValue(value)}</p>
      
      {change !== undefined && (
        <div className={`text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {formatPercentage(change)} {subtitle || ""}
        </div>
      )}

      {subtitle && change === undefined && (
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
