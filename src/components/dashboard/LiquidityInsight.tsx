import type { LiquidityInsight } from "@/lib/insight-engine/generateInsight";

interface LiquidityInsightProps {
  insight: LiquidityInsight;
}

const confidenceConfig: Record<
  LiquidityInsight["confidence"],
  { label: string; classes: string }
> = {
  Low: {
    label: "Low Confidence",
    classes: "bg-surface-muted border-border/40 text-foreground-muted",
  },
  Medium: {
    label: "Medium Confidence",
    classes: "bg-accent-surface border-accent/20 text-accent",
  },
  High: {
    label: "High Confidence",
    classes: "bg-positive-surface border-positive/20 text-positive",
  },
};

export function LiquidityInsight({ insight }: LiquidityInsightProps) {
  const { observation, interpretation, implication, confidence } = insight;
  const badge = confidenceConfig[confidence];

  return (
    <div className="rounded-xl border border-border/40 bg-surface p-xl shadow-lg shadow-black/5">
      {/* Header */}
      <div className="mb-lg flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-foreground-subtle mb-xs">
            Macro Layer
          </p>
          <h2 className="text-lg font-semibold text-foreground">
            Liquidity Insight
          </h2>
        </div>
        <span
          className={`rounded-full border px-md py-xs text-xs font-semibold ${badge.classes}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Three-part insight body */}
      <div className="space-y-md">
        {/* Observation */}
        <div className="rounded-lg border border-border/30 bg-surface-muted px-lg py-md">
          <p className="mb-xs text-xs font-medium uppercase tracking-wide text-foreground-subtle">
            Observation
          </p>
          <p className="text-sm text-foreground-muted">{observation}</p>
        </div>

        {/* Interpretation */}
        <div className="rounded-lg border border-border/30 bg-surface px-lg py-md">
          <p className="mb-xs text-xs font-medium uppercase tracking-wide text-foreground-subtle">
            Interpretation
          </p>
          <p className="text-sm font-semibold text-foreground">{interpretation}</p>
        </div>

        {/* Implication */}
        <div className="rounded-lg border border-border/30 bg-surface-muted px-lg py-md">
          <p className="mb-xs text-xs font-medium uppercase tracking-wide text-foreground-subtle">
            Implication
          </p>
          <p className="text-sm text-foreground-muted">{implication}</p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-lg text-xs text-foreground-subtle">
        Macro interpretation only. Not a trading signal.
      </p>
    </div>
  );
}
