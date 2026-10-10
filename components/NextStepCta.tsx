"use client";

import { SUBMIT_CTA } from "@/components/LeadForm";
import { focusLeadForm } from "@/lib/lead-flow";
import { track } from "@/lib/track";
import { useLeadFlow } from "@/lib/use-lead-flow";

export type NextStep = "calc" | "form" | null;

/** Další krok návštěvníka: před výsledkem kalkulačka, po výsledku formulář, po odeslání nic. */
export function useNextStep(): NextStep {
  const flow = useLeadFlow();
  if (flow.submittedAt) return null;
  return flow.calcDone ? "form" : "calc";
}

/**
 * Výzva k dalšímu kroku pro spodní lištu i patičku (stejná logika, jiné umístění v eventu `cta`).
 * Formulář: „Poslat mi srovnání“ dá focus do pole pro e-mail. Kalkulačka: odkaz na ni.
 */
export function NextStepCta({ step, cta, className }: { step: "calc" | "form"; cta: string; className: string }) {
  if (step === "form") {
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
  return (
    <a href="#kalkulacka" onClick={() => track("hero_cta_click", { cta })} className={className}>
      Spočítat své poplatky
    </a>
  );
}
