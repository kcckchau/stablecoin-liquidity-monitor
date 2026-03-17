import { Header, Container } from "@/components/layout";
import {
  MetricCard,
  RegimeHero,
  SignalSummary,
  ChartPanel,
  ContextCard,
  RecentSignals,
} from "@/components/dashboard";
import { getLatestStablecoinOverview } from "@/lib/queries/overview";
import { getStablecoinHistory } from "@/lib/queries/history";
import { formatSupply, formatChangePercent } from "@/lib/normalization/stablecoins";
import { StablecoinSupplyChart } from "@/components/dashboard/stablecoin-supply-chart";

/**
 * Dashboard Page
 * 
 * Main overview dashboard showing liquidity regime and key metrics.
 * Displays real-time stablecoin liquidity conditions and market signals.
 * 
 * This is a Server Component that uses the internal API helpers.
 */
export default async function DashboardPage() {
  // Fetch data using the same helpers as the API routes
  const [overview, history] = await Promise.all([
    getLatestStablecoinOverview(),
    getStablecoinHistory("30D"),
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
    ],
    regime: {
      regime: metrics.liquidityRegimeLabel,
      score: metrics.liquidityRegimeScore !== null ? Math.round(metrics.liquidityRegimeScore) : 50,
      change: metrics.totalSupplyChange7d !== null 
        ? `${metrics.totalSupplyChange7d >= 0 ? '+' : ''}${metrics.totalSupplyChange7d.toFixed(1)}% vs 7d ago`
        : "N/A",
      description:
        "Composite signal based on stablecoin supply growth. Expanding supply typically indicates risk-on conditions.",
      signals: [
        { 
          label: "Stablecoin Growth", 
          value: (metrics.totalSupplyChange7d || 0) > 1 ? "Strong" : (metrics.totalSupplyChange7d || 0) > 0 ? "Moderate" : "Contracting", 
          sentiment: (metrics.totalSupplyChange7d || 0) > 0 ? "positive" as const : "negative" as const 
        },
        { 
          label: "Exchange Flow", 
          value: "Pending implementation", 
          sentiment: "neutral" as const 
        },
        { 
          label: "Total Supply", 
          value: stablecoin.totalSupplyLatest !== null ? formatSupply(stablecoin.totalSupplyLatest) : "N/A", 
          sentiment: "neutral" as const 
        },
      ],
    },
    signalSummary: {
      title: "Signal Summary",
      description: "Fast read of current regime drivers.",
      signals: [
        { text: (metrics.totalSupplyChange7d || 0) > 0 ? "Stablecoin supply expanding" : "Stablecoin supply contracting" },
        { text: "Exchange flow tracking: Pending implementation" },
        { text: stablecoin.totalSupplyLatest !== null ? `Total supply: ${formatSupply(stablecoin.totalSupplyLatest)}` : "No data" },
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
        { 
          text: "Exchange flow monitoring: Coming soon", 
          time: "Pending", 
          sentiment: "neutral" as const 
        },
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
          <StablecoinSupplyChart 
            data={history.stablecoinSupplyTrend}
            isEmpty={!hasData}
          />
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
