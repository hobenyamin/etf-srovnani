"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { startAnalytics, stopAnalytics } from "@/lib/analytics";
import { saveConsent } from "@/lib/consent";
import { useBannerVisible, useConsent } from "@/lib/use-consent";

const choice =
  "flex h-12 items-center justify-center rounded-sm border-2 border-ink bg-card px-3 text-[15px] font-semibold text-ink outline-offset-2 focus-visible:outline-2 focus-visible:outline-ink";

/**
 * Lišta souhlasu s měřením. Odmítnout je stejně snadné jako povolit: stejná velikost, stejný vzhled,
 * jedno klepnutí. Neblokuje obsah. Zároveň spouští a vypíná PostHog podle uložené volby.
 */
export function CookieBanner() {
  const consent = useConsent();
  const visible = useBannerVisible();
  const heading = useRef<HTMLHeadingElement>(null);
  const analytics = consent.status === "decided" && consent.consent.analytics;
  const settingsOpen = consent.status === "decided" && consent.settingsOpen;

  useEffect(() => {
    if (consent.status === "unknown") return;
    if (analytics) void startAnalytics();
    else stopAnalytics();
  }, [consent.status, analytics]);

  // Otevřeno z patičky → přesunout fokus do lišty (při prvním příchodu fokus nebereme)
  useEffect(() => {
    if (settingsOpen) heading.current?.focus();
  }, [settingsOpen]);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Nastavení cookies"
      data-testid="cookie-banner"
      className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink bg-paper px-4 pt-3 pb-4"
    >
      <div className="mx-auto max-w-xl">
        <h2 ref={heading} tabIndex={-1} className="font-semibold outline-none">
          Smíme měřit, jak stránku používáte?
        </h2>
        <p className="mt-1 text-[13px] leading-5">
          Jen se souhlasem použijeme PostHog (servery v&nbsp;EU) a&nbsp;cookies ke statistice, které části stránky
          lidé používají. Žádná reklama. Bez souhlasu neměříme nic.{" "}
          <Link href="/zasady#cookies" className="underline">
            Podrobnosti
          </Link>
          {settingsOpen && (
            <span className="block font-semibold">Teď: {analytics ? "měření povoleno" : "měření odmítnuto"}.</span>
          )}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" className={choice} onClick={() => saveConsent({ analytics: false })}>
            Odmítnout
          </button>
          <button type="button" className={choice} onClick={() => saveConsent({ analytics: true })}>
            Povolit měření
          </button>
        </div>
      </div>
    </div>
  );
}
