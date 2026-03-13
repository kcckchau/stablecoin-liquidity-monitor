import { Header, Container, Section } from "@/components/layout";

/**
 * Liquidity Page
 * Placeholder for future liquidity-focused view
 */
export default function LiquidityPage() {
  return (
    <>
      <Header
        title="Liquidity Analysis"
        subtitle="Deep dive into macro liquidity conditions"
      />

      <Container className="py-xl">
        <Section>
          <div className="bg-surface border border-border rounded-lg p-xl">
            <p className="text-foreground-muted text-center">
              Liquidity analysis view - to be implemented
            </p>
          </div>
        </Section>
      </Container>
    </>
  );
}
