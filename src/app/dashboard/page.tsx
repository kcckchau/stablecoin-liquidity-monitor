import { Header, Container } from "@/components/layout";
import {
  MetricCard,
  RegimeHero,
  SignalSummary,
  ChartPanel,
  ContextCard,
  RecentSignals,
  StablecoinSupplyChart,
} from "@/components/dashboard";
import { getLatestStablecoinOverview } from "@/lib/queries/overview";
import { getFredOverview } from "@/lib/queries/fred";
import { formatSupply, formatChangePercent } from "@/lib/normalization/stablecoins";
import { formatFredValue } from "@/lib/normalization/fred";

/**
 * Dashboard Page
 * 
 * Main overview dashboard showing liquidity regime and key metrics.
 * Displays real-time stablecoin liquidity conditions and market signals.
 * 
 * This is a Server Component that uses the internal API helpers.
 */
export default async function DashboardPage() {
  // Fetch overview data (chart fetches its own data client-side)
  const [overview, fredData] = await Promise.all([
    getLatestStablecoinOverview(),
    getFredOverview().catch(() => ({ rrp: { latest: null, change7d: null, change30d: null, lastUpdated: null }, tga: { latest: null, change7d: null, change30d: null, lastUpdated: null }, hasData: false })),
  ]);

  const { metrics, stablecoin } = overview;
  
  // Determine sentiment from regime label
  const regimeSentiment = 
    metrics.liquidityRegimeLabel === "Risk ON" ? "positive" :
    metrics.liquidityRegimeLabel === "Risk OFF" ? "negative" :
    "neutral";

  // Prepare dashboard data
  const dashboardData = {
    metrics: [
      {
        label: "Liquidity Regime",
        value: metrics.liquidityRegimeLabel,
        change: metrics.totalSupplyChange7d !== null ? formatChangePercent(metrics.totalSupplyChange7d) : "N/A",
        changeLabel: "vs 7d trend",
        sentiment: regimeSentiment as "positive" | "negative" | "neutral",
      },
      {
        label: "USDT Net Mint (7D)",
        value: metrics.usdtNetMint7d !== null ? formatSupply(Math.abs(metrics.usdtNetMint7d)) : "N/A",
        change: metrics.usdtNetMint7d !== null ? formatChangePercent((metrics.usdtNetMint7d / (stablecoin.totalSupplyLatest || 1)) * 100) : "N/A",
        changeLabel: "of total supply",
        sentiment: (metrics.usdtNetMint7d || 0) >= 0 ? "positive" as const : "negative" as const,
      },
      {
        label: "USDC Net Mint (7D)",
        value: metrics.usdcNetMint7d !== null ? formatSupply(Math.abs(metrics.usdcNetMint7d)) : "N/A",
        change: metrics.usdcNetMint7d !== null ? formatChangePercent((metrics.usdcNetMint7d / (stablecoin.totalSupplyLatest || 1)) * 100) : "N/A",
        changeLabel: "of total supply",
        sentiment: (metrics.usdcNetMint7d || 0) >= 0 ? "positive" as const : "negative" as const,
      },
      {
        label: "Exchange Netflow (7D)",
        value: metrics.exchangeNetflow !== null ? `$${(Math.abs(metrics.exchangeNetflow) / 1e6).toFixed(0)}M` : "Pending",
        change: metrics.exchangeNetflow !== null && metrics.exchangeNetflow < 0 ? "Outflow (bullish)" : "Not implemented",
        sentiment: "neutral" as const,
      },
      {
        label: "Reverse Repo (RRP)",
        value: fredData.rrp.latest ? formatFredValue(fredData.rrp.latest.value, fredData.rrp.latest.units) : "N/A",
        change: fredData.rrp.change7d ? `${fredData.rrp.change7d.percent >= 0 ? '+' : ''}${fredData.rrp.change7d.percent.toFixed(1)}% (7D)` : "N/A",
        changeLabel: "High RRP = High liquidity",
        sentiment: fredData.rrp.change7d ? (fredData.rrp.change7d.direction === "increase" ? "positive" as const : fredData.rrp.change7d.direction === "decrease" ? "negative" as const : "neutral" as const) : "neutral" as const,
      },
      {
        label: "Treasury General Account",
        value: fredData.tga.latest ? formatFredValue(fredData.tga.latest.value, fredData.tga.latest.units) : "N/A",
        change: fredData.tga.change7d ? `${fredData.tga.change7d.percent >= 0 ? '+' : ''}${fredData.tga.change7d.percent.toFixed(1)}% (7D)` : "N/A",
        changeLabel: "Rising TGA = Liquidity drain",
        sentiment: fredData.tga.change7d ? (fredData.tga.change7d.direction === "decrease" ? "positive" as const : fredData.tga.change7d.direction === "increase" ? "negative" as const : "neutral" as const) : "neutral" as const,
      },
    ],
    regime: {
      regime: metrics.liquidityRegimeLabel,
      score: metrics.liquidityRegimeScore !== null ? Math.round(metrics.liquidityRegimeScore) : 50,
      change: metrics.totalSupplyChange7d !== null 
        ? `${metrics.totalSupplyChange7d >= 0 ? '+' : ''}${metrics.totalSupplyChange7d.toFixed(1)}% vs 7d ago`
        : "N/A",
      description:
        "Composite signal based on stablecoin supply growth and Fed macro liquidity indicators (RRP, TGA). Expanding supply + high RRP + falling TGA typically indicates risk-on conditions.",
      signals: [
        { 
          label: "Stablecoin Growth", 
          value: (metrics.totalSupplyChange7d || 0) > 1 ? "Strong" : (metrics.totalSupplyChange7d || 0) > 0 ? "Moderate" : "Contracting", 
          sentiment: (metrics.totalSupplyChange7d || 0) > 0 ? "positive" as const : "negative" as const 
        },
        { 
          label: "RRP Liquidity", 
          value: fredData.rrp.latest ? formatFredValue(fredData.rrp.latest.value, "Billions") : "N/A", 
          sentiment: fredData.rrp.change7d ? (fredData.rrp.change7d.direction === "increase" ? "positive" as const : "negative" as const) : "neutral" as const 
        },
        { 
          label: "TGA Balance", 
          value: fredData.tga.latest ? formatFredValue(fredData.tga.latest.value, "Millions") : "N/A", 
          sentiment: fredData.tga.change7d ? (fredData.tga.change7d.direction === "decrease" ? "positive" as const : "negative" as const) : "neutral" as const 
        },
      ],
    },
    signalSummary: {
      title: "Signal Summary",
      description: "Fast read of current regime drivers.",
      signals: [
        { text: (metrics.totalSupplyChange7d || 0) > 0 ? "Stablecoin supply expanding" : "Stablecoin supply contracting" },
        { text: fredData.rrp.latest ? `RRP at ${formatFredValue(fredData.rrp.latest.value, "Billions")} (${fredData.rrp.change7d?.direction || "stable"})` : "RRP data pending" },
        { text: fredData.tga.latest ? `TGA at ${formatFredValue(fredData.tga.latest.value, "Millions")} (${fredData.tga.change7d?.direction || "stable"})` : "TGA data pending" },
      ],
    },
    btcContext: {
      title: "BTC Context",
      description: "Price and structure overlay against liquidity backdrop.",
      items: [
        { label: "Trend", value: "Higher lows intact", indicator: "•" },
        { label: "Momentum", value: "Cooling near resistance", indicator: "•" },
      ],
    },
    ethContext: {
      title: "ETH Context",
      description: "Relative strength and market participation snapshot.",
      items: [
        { label: "Trend", value: "Neutral-positive", indicator: "•" },
        { label: "Relative Strength", value: "Mixed", indicator: "•" },
      ],
    },
    recentSignals: {
      title: "Recent Signals",
      description: "Latest observations from the liquidity monitor.",
      signals: [
        { 
          text: (metrics.totalSupplyChange7d || 0) > 1 ? "Strong stablecoin expansion detected" : "Moderate supply growth", 
          time: "Updated", 
          sentiment: (metrics.totalSupplyChange7d || 0) > 0 ? "positive" as const : "neutral" as const 
        },
        ...(fredData.rrp.latest ? [{ 
          text: `RRP ${fredData.rrp.change7d?.direction || "stable"}: ${formatFredValue(fredData.rrp.latest.value, "Billions")}`, 
          time: new Date(fredData.rrp.lastUpdated || "").toLocaleDateString(), 
          sentiment: fredData.rrp.change7d?.direction === "increase" ? "positive" as const : "neutral" as const 
        }] : []),
        ...(fredData.tga.latest ? [{ 
          text: `TGA ${fredData.tga.change7d?.direction || "stable"}: ${formatFredValue(fredData.tga.latest.value, "Millions")}`, 
          time: new Date(fredData.tga.lastUpdated || "").toLocaleDateString(), 
          sentiment: fredData.tga.change7d?.direction === "decrease" ? "positive" as const : "neutral" as const 
        }] : []),
      ],
    },
  };

  // Calculate last updated time
  const lastUpdated = stablecoin.lastUpdated 
    ? new Date(stablecoin.lastUpdated).toLocaleString()
    : "No data";

  // Determine if we have data
  const hasData = stablecoin.totalSupplyLatest !== null && stablecoin.totalSupplyLatest > 0;

  return (
    <>
      <Header
        title="Stablecoin Liquidity Monitor"
        subtitle="Track macro liquidity conditions, stablecoin expansion, exchange flows and crypto risk regime in one command-center view."
        lastUpdated={lastUpdated}
        actions={
          <div className="flex items-center gap-md">
            <div className={`flex items-center gap-sm rounded-full border px-md py-xs shadow-sm ${
              regimeSentiment === "positive" 
                ? "border-positive/30 bg-positive-surface" 
                : regimeSentiment === "negative"
                ? "border-negative/30 bg-negative-surface"
                : "border-border/30 bg-surface-muted"
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                regimeSentiment === "positive" 
                  ? "bg-positive animate-pulse shadow-sm shadow-positive/50" 
                  : regimeSentiment === "negative"
                  ? "bg-negative animate-pulse shadow-sm shadow-negative/50"
                  : "bg-foreground-muted"
              }`}></div>
              <span className={`text-sm font-bold ${
                regimeSentiment === "positive" 
                  ? "text-positive" 
                  : regimeSentiment === "negative"
                  ? "text-negative"
                  : "text-foreground"
              }`}>{metrics.liquidityRegimeLabel}</span>
            </div>
            <div className="flex items-center gap-xs rounded-lg border border-border/40 bg-surface px-md py-xs shadow-sm">
              <div className={`h-2 w-2 rounded-full ${hasData ? "bg-positive" : "bg-negative"}`}></div>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">Data Status</span>
                <span className="text-sm font-semibold text-foreground">{hasData ? "Active" : "No Data"}</span>
              </div>
            </div>
          </div>
        }
      />

      <Container className="space-y-xl py-xl">
        {!hasData && (
          <div className="rounded-xl border border-border/40 bg-surface p-xl text-center">
            <p className="text-lg font-semibold text-foreground mb-sm">No Data Available</p>
            <p className="text-sm text-foreground-muted mb-md">
              Run the data fetch cron job to populate the dashboard with stablecoin data.
            </p>
            <code className="text-xs bg-surface-muted px-sm py-xs rounded">
              GET /api/cron/fetch-stablecoins
            </code>
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-4">
          {dashboardData.metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Hero Section: Regime + Signal Summary */}
        <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RegimeHero {...dashboardData.regime} />
          </div>
          <div>
            <SignalSummary {...dashboardData.signalSummary} />
          </div>
        </div>

        {/* Chart Panels */}
        <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
          <StablecoinSupplyChart />
          <ChartPanel
            title="Exchange Netflows"
            description="Monitor risk appetite through exchange inflow behavior."
            timeframes={["Spot + Major CEX"]}
            isEmpty={true}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-sm text-foreground-muted">Exchange flow tracking</p>
              <p className="text-xs text-foreground-subtle mt-xs">Coming in future update</p>
            </div>
          </ChartPanel>
        </div>

        {/* Supporting Panels */}
        <div className="grid grid-cols-1 gap-md md:grid-cols-3">
          <ContextCard {...dashboardData.btcContext} />
          <ContextCard {...dashboardData.ethContext} />
          <RecentSignals {...dashboardData.recentSignals} />
        </div>
      </Container>
    </>
  );
}
