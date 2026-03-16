import { Header, Container } from "@/components/layout";
import {
  MetricCard,
  RegimeHero,
  SignalSummary,
  ChartPanel,
  ContextCard,
  RecentSignals,
} from "@/components/dashboard";
import {
  getTotalStablecoinSupply,
  getSupplyChange,
  getTopStablecoins,
  getNetExchangeFlow,
} from "@/lib/queries/overview";
import { formatSupply, formatChangePercent } from "@/lib/normalization/stablecoins";

/**
 * Dashboard Page
 * 
 * Main overview dashboard showing liquidity regime and key metrics.
 * Displays real-time stablecoin liquidity conditions and market signals.
 * 
 * This is a Server Component that fetches data directly from the database.
 */
export default async function DashboardPage() {
  // Fetch real data from database
  const [
    totalSupply,
    supplyChange7d,
    topStablecoins,
    netFlow7d,
  ] = await Promise.all([
    getTotalStablecoinSupply(),
    getSupplyChange(7),
    getTopStablecoins(3),
    getNetExchangeFlow(7),
  ]);

  // Find specific stablecoins for metrics
  const usdtData = topStablecoins.find(s => s.symbol === "USDT");
  const usdcData = topStablecoins.find(s => s.symbol === "USDC");

  // Determine regime based on supply change (simplified logic)
  const isRiskOn = supplyChange7d > 0.5;
  const regimeLabel = isRiskOn ? "Risk ON" : supplyChange7d < -0.5 ? "Risk OFF" : "Neutral";
  const regimeSentiment = isRiskOn ? "positive" : supplyChange7d < -0.5 ? "negative" : "neutral";

  // Calculate regime score (0-100 scale)
  const regimeScore = Math.min(100, Math.max(0, 50 + (supplyChange7d * 10)));

  // Prepare dashboard data
  const dashboardData = {
    metrics: [
      {
        label: "Liquidity Regime",
        value: regimeLabel,
        change: formatChangePercent(supplyChange7d),
        changeLabel: "vs 7d trend",
        sentiment: regimeSentiment as "positive" | "negative" | "neutral",
      },
      {
        label: "USDT Supply (7D)",
        value: usdtData ? formatSupply(usdtData.totalSupply) : "N/A",
        change: usdtData ? formatChangePercent(usdtData.changePercent7d) : "N/A",
        changeLabel: "week over week",
        sentiment: (usdtData?.changePercent7d || 0) >= 0 ? "positive" as const : "negative" as const,
      },
      {
        label: "USDC Supply (7D)",
        value: usdcData ? formatSupply(usdcData.totalSupply) : "N/A",
        change: usdcData ? formatChangePercent(usdcData.changePercent7d) : "N/A",
        changeLabel: "week over week",
        sentiment: (usdcData?.changePercent7d || 0) >= 0 ? "positive" as const : "negative" as const,
      },
      {
        label: "Exchange Netflow (7D)",
        value: netFlow7d !== 0 ? `${netFlow7d >= 0 ? '+' : ''}$${(Math.abs(netFlow7d) / 1e6).toFixed(0)}M` : "N/A",
        change: netFlow7d < 0 ? "Outflow (bullish)" : "Inflow",
        sentiment: netFlow7d < 0 ? "positive" as const : "neutral" as const,
      },
    ],
    regime: {
      regime: regimeLabel,
      score: Math.round(regimeScore),
      change: `${supplyChange7d >= 0 ? '+' : ''}${supplyChange7d.toFixed(1)}% vs 7d ago`,
      description:
        "Composite signal based on stablecoin supply growth. Expanding supply typically indicates risk-on conditions.",
      signals: [
        { 
          label: "Stablecoin Growth", 
          value: supplyChange7d > 1 ? "Strong" : supplyChange7d > 0 ? "Moderate" : "Contracting", 
          sentiment: supplyChange7d > 0 ? "positive" as const : "negative" as const 
        },
        { 
          label: "Exchange Flow", 
          value: netFlow7d < 0 ? "Outflow (bullish)" : "Inflow", 
          sentiment: netFlow7d < 0 ? "positive" as const : "neutral" as const 
        },
        { 
          label: "Total Supply", 
          value: formatSupply(totalSupply), 
          sentiment: "neutral" as const 
        },
      ],
    },
    signalSummary: {
      title: "Signal Summary",
      description: "Fast read of current regime drivers.",
      signals: [
        { text: supplyChange7d > 0 ? "Stablecoin supply expanding" : "Stablecoin supply contracting" },
        { text: netFlow7d < 0 ? "Net outflow from exchanges (bullish)" : "Net inflow to exchanges" },
        { text: `Total supply: ${formatSupply(totalSupply)}` },
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
          text: supplyChange7d > 1 ? "Strong stablecoin expansion detected" : "Moderate supply growth", 
          time: "Updated", 
          sentiment: supplyChange7d > 0 ? "positive" as const : "neutral" as const 
        },
        { 
          text: netFlow7d < -100_000_000 ? "Significant exchange outflows" : "Exchange flows stable", 
          time: "7d avg", 
          sentiment: netFlow7d < 0 ? "positive" as const : "neutral" as const 
        },
      ],
    },
  };

  // Calculate last updated time
  const lastUpdated = topStablecoins.length > 0 
    ? new Date(topStablecoins[0].timestamp).toLocaleString()
    : "No data";

  // Determine if we have data
  const hasData = totalSupply > 0;

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
              }`}>{regimeLabel}</span>
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
          <ChartPanel
            title="Stablecoin Supply Trend"
            description="Aggregate and major-issuer supply expansion over time."
            timeframes={["7D", "30D", "90D"]}
            isEmpty={!hasData}
          />
          <ChartPanel
            title="Exchange Netflows"
            description="Monitor risk appetite through exchange inflow behavior."
            timeframes={["Spot + Major CEX"]}
            isEmpty={!hasData}
          />
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
