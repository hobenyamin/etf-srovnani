"use client";

import { useEffect } from "react";

/**
 * Sekce s data-reveal se při posunu jemně objeví (opacity + posun 12 px, jen transform a opacity → bez CLS).
 * Skrývá se až po hydrataci a jen to, co je celé pod obrazovkou: bez JS ani nic, co je vidět hned,
 * nikdy neblikne. S omezením pohybu nic.
 */
export function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of document.querySelectorAll("[data-reveal]")) {
      if (el.getBoundingClientRect().top < innerHeight) continue;
      el.classList.add("reveal");
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return null;
}
