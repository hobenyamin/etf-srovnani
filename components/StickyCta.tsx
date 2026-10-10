"use client";

import { useEffect, useState } from "react";
import { FOOTER_CTA_ID } from "@/components/FooterCta";
import { NextStepCta, useNextStep } from "@/components/NextStepCta";
import { FORM_ANCHOR } from "@/lib/lead-flow";
import { useBannerVisible } from "@/lib/use-consent";
import { useLeadFlow } from "@/lib/use-lead-flow";

const bar = "sticky-bar fixed inset-x-0 bottom-0 z-10 border-t border-rule bg-paper/95 px-4 py-3 backdrop-blur-sm";
const LEAVE_MS = 200;
const cta = "btn-primary mx-auto h-12 w-full max-w-xl";

/**
 * Spodní lišta na mobilu podle toho, kde návštěvník je:
 * - před výsledkem kalkulačky odkaz na kalkulačku, když není vidět hero ani kalkulačka (typicky hero B
 *   → srovnání). Kalkulačka začíná už v první obrazovce, „jednou viděná“ by lištu schovala hned po načtení,
 * - po výsledku „Poslat mi srovnání“ → pole pro e-mail. Schová se, když je formulář vidět, a po odeslání,
 * - nikdy současně s toutéž výzvou v patičce (FooterCta).
 * Příchod animuje CSS (@starting-style), odchod usePresence: lišta zůstane 200 ms v DOM jako inert
 * s posledním krokem. S omezením pohybu se odpojí hned.
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

  const hidden =
    bannerVisible || footerInView || !step || (step === "form" ? formVisible : !heroOut || calcInView);
  const presence = usePresence(hidden ? null : step, LEAVE_MS);
  if (!presence) return null;
  return (
    <div className={presence.leaving ? `${bar} leaving` : bar} inert={presence.leaving} data-testid="sticky-cta">
      <NextStepCta step={presence.value} cta="sticky" className={cta} />
    </div>
  );
}

/** Drží poslední hodnotu ještě `ms` po tom, co zmizí (animace odchodu). S omezením pohybu ji pustí hned. */
function usePresence<T>(value: T | null, ms: number): { value: T; leaving: boolean } | null {
  const [kept, setKept] = useState(value);
  if (value !== null && value !== kept) setKept(value);

  useEffect(() => {
    if (value !== null || kept === null) return;
    const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
    const timer = setTimeout(() => setKept(null), delay);
    return () => clearTimeout(timer);
  }, [value, kept, ms]);

  if (kept === null) return null;
  return { value: value ?? kept, leaving: value === null };
}
