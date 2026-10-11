"use client";

import { LeadCta, useLeadCtaOpen } from "@/components/LeadCta";

export const FOOTER_CTA_ID = "paticka-cta";

/** Poslední výzva na konci stránky, stejná jako spodní lišta. Po odeslání formuláře zmizí. */
export function FooterCta() {
  if (!useLeadCtaOpen()) return null;
  return (
    <div id={FOOTER_CTA_ID} className="pb-8" data-testid="footer-cta">
      <p className="font-display text-[22px] leading-7 font-semibold text-ink">Plné srovnání všech 5 dvojic</p>
      <p className="mt-1 text-[15px] leading-6 text-ink">Zobrazí se hned po odeslání, kopii pošleme e-mailem.</p>
      <LeadCta cta="footer" className="btn-primary mt-4 h-14 w-full text-base" />
    </div>
  );
}
