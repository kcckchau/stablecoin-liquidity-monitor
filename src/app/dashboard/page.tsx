import { Header, Container, Section } from "@/components/layout";

/**
 * Dashboard Page
 * 
 * This is the main overview dashboard showing liquidity regime and key metrics.
 * Content sections will be implemented in TASK 4.
 */
export default function DashboardPage() {
  return (
    <>
      <Header
        title="Stablecoin Liquidity Monitor"
        subtitle="Track macro liquidity conditions and stablecoin expansion"
        lastUpdated="2 hours ago"
      />

      <Container className="py-xl space-y-xl">
        {/* Placeholder for dashboard sections - to be implemented in TASK 4 */}
        <Section title="Dashboard Content">
          <div className="bg-surface border border-border rounded-lg p-xl">
            <p className="text-foreground-muted text-center">
              Dashboard sections will be implemented in TASK 4
            </p>
            <p className="text-foreground-subtle text-sm text-center mt-sm">
              This includes: Regime Hero, Metrics Row, Charts, and Supporting Panels
            </p>
          </div>
        </Section>
      </Container>
    </>
  );
}
