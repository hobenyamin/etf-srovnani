import { Calculator } from "@/components/Calculator";
import { Comparison } from "@/components/Comparison";
import { Footer } from "@/components/Footer";
import { FullComparison } from "@/components/FullComparison";
import { Hero } from "@/components/Hero";
import { LeadForm } from "@/components/LeadForm";
import { PageView } from "@/components/PageView";
import { StickyCta } from "@/components/StickyCta";
import { Trust } from "@/components/Trust";
import { FEE_ROWS } from "@/lib/fee-rows";
import type { AdVariant } from "@/lib/track";

export function Landing({ variant }: { variant: AdVariant }) {
  return (
    <>
      <main className="mx-auto w-full max-w-xl flex-1">
        <PageView variant={variant} />
        <Hero variant={variant} />
        <Calculator rows={FEE_ROWS} fullComparison={<FullComparison />} />
        <Comparison />
        <LeadForm fullComparison={<FullComparison />} />
        <Trust />
        <StickyCta />
      </main>
      <Footer />
    </>
  );
}
