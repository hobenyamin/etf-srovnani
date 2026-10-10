"use client";

import { useEffect, useState } from "react";
import { FOOTER_CTA_ID } from "@/components/FooterCta";
import { NextStepCta, useNextStep } from "@/components/NextStepCta";
import { FORM_ANCHOR } from "@/lib/lead-flow";
import { useBannerVisible } from "@/lib/use-consent";
import { useLeadFlow } from "@/lib/use-lead-flow";

const bar = "fixed inset-x-0 bottom-0 z-10 border-t border-rule bg-paper/95 px-4 py-3 backdrop-blur-sm";
const cta = "btn-primary mx-auto h-12 w-full max-w-xl";

/**
 * Spodní lišta na mobilu podle toho, kde návštěvník je:
 * - před výsledkem kalkulačky odkaz na kalkulačku, když není vidět hero ani kalkulačka (typicky hero B
 *   → srovnání). Kalkulačka začíná už v první obrazovce, „jednou viděná“ by lištu schovala hned po načtení,
 * - po výsledku „Poslat mi srovnání“ → pole pro e-mail. Schová se, když je formulář vidět, a po odeslání,
 * - nikdy současně s toutéž výzvou v patičce (FooterCta).
 */
export function StickyCta() {
  const [heroOut, setHeroOut] = useState(false);
  const [calcInView, setCalcInView] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const flow = useLeadFlow();
  const step = useNextStep();
  // Dvě spodní lišty přes sebe ne: dokud je vidět lišta cookies, CTA počká
  const bannerVisible = useBannerVisible();

  useEffect(() => {
    const hero = document.getElementById("hero");
    const calc = document.getElementById("kalkulacka");
    const footer = document.getElementById(FOOTER_CTA_ID);
    if (!hero || !calc) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroOut(!entry.isIntersecting);
        if (entry.target === calc) setCalcInView(entry.isIntersecting);
        if (entry.target === footer) setFooterInView(entry.isIntersecting);
      }
    });
    observer.observe(hero);
    observer.observe(calc);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Formulář pod kalkulačkou vzniká až po výsledku, proto se sleduje znovu při každé změně
  useEffect(() => {
    if (!flow.calcDone) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setFormVisible(visible.size > 0);
    });
    for (const id of Object.values(FORM_ANCHOR)) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [flow.calcDone, flow.activeForm]);

  if (bannerVisible || footerInView || !step) return null;
  if (step === "form" ? formVisible : !heroOut || calcInView) return null;
  return (
    <div className={bar} data-testid="sticky-cta">
      <NextStepCta step={step} cta="sticky" className={cta} />
    </div>
  );
}
