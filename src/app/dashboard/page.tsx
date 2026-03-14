import { Header, Container } from "@/components/layout";
import {
  MetricCard,
  RegimeHero,
  SignalSummary,
  ChartPanel,
  ContextCard,
  RecentSignals,
} from "@/components/dashboard";

/**
 * Dashboard Page
 * 
 * Main overview dashboard showing liquidity regime and key metrics.
 * Displays real-time stablecoin liquidity conditions and market signals.
 */
export default function DashboardPage() {
  // Mock data for dashboard sections
  const mockData = {
    metrics: [
      {
        label: "Liquidity Regime",
        value: "Risk ON",
        change: "+ 12 bps",
        changeLabel: "vs 7d trend",
        sentiment: "positive" as const,
      },
      {
        label: "USDT Net Mint (7D)",
        value: "+$842M",
        change: "+18.4%",
        changeLabel: "week over week",
        sentiment: "positive" as const,
      },
      {
        label: "USDC Net Mint (7D)",
        value: "+$214M",
        change: "−3.2%",
        changeLabel: "week over week",
        sentiment: "negative" as const,
      },
      {
        label: "Exchange Netflow",
        value: "−$391M",
        change: "Risk supportive",
        sentiment: "positive" as const,
      },
    ],
    regime: {
      regime: "Risk ON",
      score: 72,
      change: "+ 6 vs yesterday",
      description:
        "Composite signal across stablecoin growth, exchange balances, and macro liquidity inputs.",
      signals: [
        { label: "Stablecoin Growth", value: "Strong", sentiment: "positive" as const },
        { label: "Exchange Flow", value: "Supportive", sentiment: "positive" as const },
        { label: "Macro Input", value: "Neutral+", sentiment: "neutral" as const },
      ],
    },
    signalSummary: {
      title: "Signal Summary",
      description: "Fast read of current regime drivers.",
      signals: [
        { text: "Stablecoin supply expanding" },
        { text: "Exchange balances trending lower" },
        { text: "BTC structure still constructive" },
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
      description: "Latest machine-generated observations from the monitor.",
      signals: [
        { text: "Stablecoin expansion accelerating", time: "12m ago", sentiment: "positive" as const },
        { text: "Exchange balances drifting lower", time: "28m ago", sentiment: "positive" as const },
      ],
    },
  };

  return (
    <>
      <Header
        title="Stablecoin Liquidity Monitor"
        subtitle="Track macro liquidity conditions, stablecoin expansion, exchange flows and crypto risk regime in one command-center view."
        lastUpdated="2 hours ago"
        actions={
          <div className="flex items-center gap-xs rounded-md border border-border bg-surface px-md py-xs">
            <div className="h-2 w-2 rounded-full bg-positive"></div>
            <div className="flex flex-col">
              <span className="text-xs text-foreground-subtle">Data Freshness</span>
              <span className="text-sm font-medium text-foreground">Healthy</span>
            </div>
          </div>
        }
      />

      <Container className="space-y-xl py-xl">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-4">
          {mockData.metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Hero Section: Regime + Signal Summary */}
        <div className="grid grid-cols-1 gap-md lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RegimeHero {...mockData.regime} />
          </div>
          <div>
            <SignalSummary {...mockData.signalSummary} />
          </div>
        </div>

        {/* Chart Panels */}
        <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
          <ChartPanel
            title="Stablecoin Supply Trend"
            description="Aggregate and major-issuer supply expansion over time."
            timeframes={["7D", "30D", "90D"]}
          />
          <ChartPanel
            title="Exchange Netflows"
            description="Monitor risk appetite through exchange inflow behavior."
            timeframes={["Spot + Major CEX"]}
          />
        </div>

        {/* Supporting Panels */}
        <div className="grid grid-cols-1 gap-md md:grid-cols-3">
          <ContextCard {...mockData.btcContext} />
          <ContextCard {...mockData.ethContext} />
          <RecentSignals {...mockData.recentSignals} />
        </div>
      </Container>
    </>
  );
}
