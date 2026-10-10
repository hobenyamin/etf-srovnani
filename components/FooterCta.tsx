"use client";

import { NextStepCta, useNextStep } from "@/components/NextStepCta";

export const FOOTER_CTA_ID = "paticka-cta";

/** Poslední výzva na konci stránky, stejná logika jako spodní lišta. Po odeslání formuláře zmizí. */
export function FooterCta() {
  const step = useNextStep();
  if (!step) return null;
  return (
    <div id={FOOTER_CTA_ID} className="pb-8" data-testid="footer-cta">
      <p className="font-display text-[22px] leading-7 font-semibold text-ink">
        {step === "form" ? "Plné srovnání všech 5 dvojic" : "Kolik vás budou stát poplatky?"}
      </p>
      <p className="mt-1 text-[15px] leading-6 text-ink">
        {step === "form"
          ? "Zobrazí se hned po odeslání, kopii pošleme e-mailem."
          : "Zadejte svou částku, výsledek v Kč uvidíte hned."}
      </p>
      <NextStepCta step={step} cta="footer" className="btn-primary mt-4 h-14 w-full text-base" />
    </div>
  );
}
