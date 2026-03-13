import { Header, Container, Section } from "@/components/layout";

/**
 * Stablecoins Page
 * Placeholder for stablecoin-specific analysis
 */
export default function StablecoinsPage() {
  return (
    <>
      <Header
        title="Stablecoins"
        subtitle="Stablecoin supply trends and distribution"
      />

      <Container className="py-xl">
        <Section>
          <div className="bg-surface border border-border rounded-lg p-xl">
            <p className="text-foreground-muted text-center">
              Stablecoin analysis view - to be implemented
            </p>
          </div>
        </Section>
      </Container>
    </>
  );
}
