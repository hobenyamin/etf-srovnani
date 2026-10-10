import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmEmail } from "@/components/ConfirmEmail";
import { Footer } from "@/components/Footer";
import { FullComparison } from "@/components/FullComparison";
import { OpenSourceOnJump } from "@/components/OpenSourceOnJump";

export const metadata: Metadata = {
  title: "Potvrzení e-mailu – srovnání ETF",
  robots: { index: false },
};

// Statická stránka; token z odkazu (?t=…) čte až prohlížeč. Potvrzuje teprve tlačítko,
// takže bezpečnostní skenery odkazů v e-mailových schránkách adresu samy nepotvrdí.
export default function Potvrzeni() {
  return (
    <>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
        <p className="text-[13px] tracking-wide text-muted uppercase">Srovnání ETF z NYSE · pro investory v ČR</p>
        <OpenSourceOnJump />
        <Suspense>
          <ConfirmEmail fullComparison={<FullComparison />} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
