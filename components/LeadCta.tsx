"use client";

import { SUBMIT_CTA } from "@/components/LeadForm";
import { focusLeadForm } from "@/lib/lead-flow";
import { track } from "@/lib/track";
import { useLeadFlow } from "@/lib/use-lead-flow";

/** Výzva k e-mailu má smysl do odeslání formuláře. */
export function useLeadCtaOpen(): boolean {
  return !useLeadFlow().submittedAt;
}

/**
 * Výzva k e-mailu pro spodní lištu i patičku (liší se jen `cta` v eventu). Kontakt je hlavní cíl, proto vede
 * vždy k aktivnímu formuláři: po výsledku kalkulačky k poli pod ním, jinak ke spodnímu formuláři.
 */
export function LeadCta({ cta, className }: { cta: "sticky" | "footer"; className: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        track("form_cta_click", { cta });
        focusLeadForm();
      }}
      className={className}
    >
      {SUBMIT_CTA}
    </button>
  );
}
