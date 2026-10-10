"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { submitLead } from "@/app/actions/lead";
import { ThankYou } from "@/components/ThankYou";
import { TrackView } from "@/components/TrackView";
import { isValidEmail, type LeadPayload, normalizeEmail } from "@/lib/lead";
import {
  FORM_ANCHOR,
  focusLeadForm,
  type FormLocation,
  markSubmitted,
  setDelivery,
  touchBottomForm,
} from "@/lib/lead-flow";
import { CONSENT } from "@/lib/site";
import { trackOnce } from "@/lib/track";
import { useLeadFlow } from "@/lib/use-lead-flow";
import { getAdVariant, getCalcInput, utmFromUrl } from "@/lib/visit";

export const SUBMIT_CTA = "Poslat mi srovnání";

const button =
  "btn-primary h-14 w-full text-base";

/**
 * Spodní sekce formuláře. Pro ty, kdo kalkulačku přeskočili (hero B). Po výsledku kalkulačky je
 * aktivní formulář pod ním a tady zůstane jen odkaz na něj – návštěvník nikdy nevidí dvě pole pro e-mail.
 */
export function LeadForm({ fullComparison }: { fullComparison: ReactNode }) {
  const flow = useLeadFlow();
  return (
    <section id="formular" aria-labelledby="formular-h" className="scroll-mt-4 border-t border-rule px-4 py-12">
      {flow.submittedAt === "bottom" ? (
        <ThankYou delivery={flow.delivery} leadRef={flow.leadRef}>
          {fullComparison}
        </ThankYou>
      ) : flow.submittedAt === "calc" ? (
        <div data-testid="lead-done">
          <h2 id="formular-h" className="font-display text-[28px] leading-9 font-semibold">
            Plné srovnání máte u&nbsp;svého výpočtu
          </h2>
          <a href={`#${FORM_ANCHOR.calc}`} className="mt-3 inline-block font-semibold text-action underline underline-offset-4">
            Zobrazit srovnání ↑
          </a>
        </div>
      ) : (
        <>
          <h2 id="formular-h" className="font-display text-[28px] leading-9 font-semibold">
            Plné srovnání všech 5&nbsp;dvojic
          </h2>
          <ul className="mt-4 space-y-2 text-[15px] leading-6">
            <li className="dotted pb-2">
              VOO, SPY, IVV, VTI a&nbsp;VT vedle UCITS fondů, které jsou v&nbsp;ČR dostupné
            </li>
            <li className="dotted pb-2">TER, měna, akumulace, burza, velikost fondu, registrace v&nbsp;ČR, ISIN</li>
          </ul>
          <p className="mt-3 text-[15px] font-semibold">Zobrazí se hned po odeslání, kopii pošleme e-mailem.</p>
          {flow.activeForm === "bottom" ? (
            <TrackView event="form_view" props={{ form_location: "bottom" }}>
              <LeadFormFields location="bottom" submitLabel="Zobrazit plné srovnání" className="mt-6" />
            </TrackView>
          ) : (
            <button type="button" onClick={focusLeadForm} className={`mt-6 ${button}`} data-testid="lead-pointer">
              {SUBMIT_CTA}
            </button>
          )}
        </>
      )}
    </section>
  );
}

/**
 * E-mail + nepovinný souhlas s novinkami. Po odeslání se slíbený obsah zobrazí hned – uložení leadu
 * běží na pozadí, a když selže (Supabase nedostupný), návštěvník srovnání stejně dostane.
 */
export function LeadFormFields({
  location,
  submitLabel,
  className = "",
}: {
  location: FormLocation;
  submitLabel: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const shownAt = useRef(0);
  const ids = { email: useId(), error: useId(), consent: useId(), gdpr: useId() };

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = normalizeEmail(email);
    if (!isValidEmail(value)) {
      setError(value ? "Zkontrolujte prosím e-mail, něco v něm chybí." : "Vyplňte prosím e-mail.");
      emailRef.current?.focus();
      return;
    }
    setError(null);
    trackOnce("form_submit", { marketing_consent: marketing, form_location: location });

    const payload: LeadPayload = {
      email: value,
      marketing,
      adVariant: getAdVariant(),
      utm: utmFromUrl(),
      calcInput: getCalcInput(),
      website: honeypotRef.current?.value ?? "",
      elapsedMs: Date.now() - shownAt.current,
    };
    markSubmitted(location);
    // Formulář se tím odpojí, výsledek uložení jde do sdíleného stavu (lib/lead-flow.ts)
    void (async () => {
      try {
        const result = await submitLead(payload);
        setDelivery(
          !result.ok || !result.stored ? "failed" : result.alreadyConfirmed ? "confirmed" : "sent",
          result.ok ? result.ref : null,
        );
      } catch {
        setDelivery("failed", null);
      }
    })();
  }

  return (
    <form noValidate onSubmit={onSubmit} className={`relative ${className}`} aria-describedby={ids.gdpr}>
      <label htmlFor={ids.email} className="block font-semibold">
        E-mail
      </label>
      <input
        ref={emailRef}
        id={ids.email}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => {
          if (location === "bottom") touchBottomForm();
          setEmail(e.target.value);
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? ids.error : undefined}
        className="mt-2 h-12 w-full rounded-sm border border-ink bg-card px-3 text-lg aria-invalid:border-2 aria-invalid:border-loss"
      />
      {error && (
        <p id={ids.error} role="alert" className="mt-2 text-[15px] font-semibold text-loss">
          {error}
        </p>
      )}

      {/* Past na roboty: člověk pole nevidí ani na něj nedojde klávesnicí. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Nevyplňujte
          <input ref={honeypotRef} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="mt-4 flex gap-3">
        <input
          id={ids.consent}
          name="marketing"
          type="checkbox"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-ink"
        />
        <label htmlFor={ids.consent} className="text-[14px] leading-5">
          {CONSENT.marketing} <span className="text-muted">(nepovinné)</span>
        </label>
      </div>

      <button type="submit" className={`mt-6 ${button}`}>
        {submitLabel}
      </button>

      <p id={ids.gdpr} className="fine mt-4">
        {CONSENT.notice} Podrobnosti v{" "}
        <Link href="/zasady" className="underline">
          zásadách ochrany osobních údajů
        </Link>
        .
      </p>
    </form>
  );
}
