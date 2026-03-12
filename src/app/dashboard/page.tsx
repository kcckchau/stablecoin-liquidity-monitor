"use client";

import { useEffect, useState } from "react";
import { RegimeCard } from "@/components/cards/regime-card";
import { MetricCard } from "@/components/cards/metric-card";
import { SignalSummary } from "@/components/signals/signal-summary";
import { LiquidityChart } from "@/components/charts/liquidity-chart";
import type { OverviewResponse, RegimeResponse, HistoryResponse, ApiResponse } from "@/types/api";

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [regime, setRegime] = useState<RegimeResponse | null>(null);
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [overviewRes, regimeRes, historyRes] = await Promise.all([
          fetch("/api/overview"),
          fetch("/api/regime"),
          fetch("/api/history?days=30"),
        ]);

        const overviewData: ApiResponse<OverviewResponse> = await overviewRes.json();
        const regimeData: ApiResponse<RegimeResponse> = await regimeRes.json();
        const historyData: ApiResponse<HistoryResponse> = await historyRes.json();

        if (overviewData.success) setOverview(overviewData.data);
        if (regimeData.success) setRegime(regimeData.data);
        if (historyData.success) setHistory(historyData.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Stablecoin Liquidity Monitor</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time crypto liquidity intelligence</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading dashboard...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics Grid */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Stablecoin Supply"
                  value={overview?.totalStablecoinSupply || 0}
                  change={overview?.supplyChange7d}
                  format="currency"
                  subtitle="7d change"
                />
                <MetricCard
                  title="24h Supply Change"
                  value={overview?.supplyChange24h || 0}
                  format="percentage"
                />
                <MetricCard
                  title="7d Net Exchange Flow"
                  value={overview?.netExchangeFlow7d || 0}
                  format="currency"
                />
                <MetricCard
                  title="24h Net Flow"
                  value={overview?.netExchangeFlow24h || 0}
                  format="currency"
                />
              </div>
            </section>

            {/* Regime and Signals */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Liquidity Regime</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RegimeCard regime={regime?.current} />
                <SignalSummary signals={regime?.signals || []} />
              </div>
            </section>

            {/* Historical Chart */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Historical Trends</h2>
              <LiquidityChart data={history || undefined} />
            </section>

            {/* Top Stablecoins */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Top Stablecoins</h2>
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supply
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        24h Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        7d Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {overview?.topStablecoins.map((coin) => (
                      <tr key={coin.symbol}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{coin.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${(coin.totalSupply / 1e9).toFixed(2)}B
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${
                          coin.changePercent24h >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {coin.changePercent24h >= 0 ? "+" : ""}
                          {coin.changePercent24h.toFixed(2)}%
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${
                          coin.changePercent7d >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {coin.changePercent7d >= 0 ? "+" : ""}
                          {coin.changePercent7d.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
