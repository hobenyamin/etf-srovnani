"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/track";
import { useBannerVisible } from "@/lib/use-consent";

/** Spodní lišta na mobilu: jen odkaz na kalkulačku, nikdy formulář. Zobrazí se po odscrollování
 *  z hero a zmizí natrvalo, jakmile návštěvník kalkulačku uvidí. */
export function StickyCta() {
  const [heroOut, setHeroOut] = useState(false);
  const [calcSeen, setCalcSeen] = useState(false);
  // Dvě spodní lišty přes sebe ne: dokud je vidět lišta cookies, CTA počká
  const bannerVisible = useBannerVisible();

  useEffect(() => {
    const hero = document.getElementById("hero");
    const calc = document.getElementById("kalkulacka");
    if (!hero || !calc) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroOut(!entry.isIntersecting);
        if (entry.target === calc && entry.isIntersecting) setCalcSeen(true);
      }
    });
    observer.observe(hero);
    observer.observe(calc);
    return () => observer.disconnect();
  }, []);

  if (!heroOut || calcSeen || bannerVisible) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-rule bg-paper/95 px-4 py-3 backdrop-blur-sm">
      <a
        href="#kalkulacka"
        onClick={() => track("hero_cta_click", { cta: "sticky" })}
        className="mx-auto flex h-12 max-w-xl items-center justify-center rounded-sm bg-ink font-semibold text-paper"
      >
        Spočítat své poplatky
      </a>
    </div>
  );
}
