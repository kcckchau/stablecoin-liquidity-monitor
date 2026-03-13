import { Header, Container, Section } from "@/components/layout";

/**
 * Signals Page
 * Placeholder for market signals view
 */
export default function SignalsPage() {
  return (
    <>
      <Header
        title="Market Signals"
        subtitle="Liquidity regime indicators and alerts"
      />

      <Container className="py-xl">
        <Section>
          <div className="bg-surface border border-border rounded-lg p-xl">
            <p className="text-foreground-muted text-center">
              Signals view - to be implemented
            </p>
          </div>
        </Section>
      </Container>
    </>
  );
}
