"use client";

import { type FormEvent, type ReactNode, useId, useRef, useState } from "react";
import { ThankYou } from "@/components/ThankYou";
import { TrackView } from "@/components/TrackView";
import { CONSENT, OPERATOR, orTodo } from "@/lib/site";
import { trackOnce } from "@/lib/track";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** E-mail + nepovinný souhlas s novinkami. Po odeslání se hned zobrazí slíbený obsah (krok 3: bez backendu). */
export function LeadForm({ fullComparison }: { fullComparison: ReactNode }) {
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const ids = { email: useId(), error: useId(), consent: useId(), gdpr: useId() };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL.test(value)) {
      setError(value ? "Zkontrolujte prosím e-mail, něco v něm chybí." : "Vyplňte prosím e-mail.");
      emailRef.current?.focus();
      return;
    }
    setError(null);
    // Krok 4: uložení leadu (Supabase), consent_text + consent_at, double opt-in
    trackOnce("form_submit", { marketing_consent: marketing });
    setSubmitted(true);
  }

  return (
    <section id="formular" aria-labelledby="formular-h" className="scroll-mt-4 border-t border-rule px-4 py-10">
      {submitted ? (
        <ThankYou>{fullComparison}</ThankYou>
      ) : (
        <TrackView event="form_view">
          <h2 id="formular-h" className="font-display text-2xl leading-8 font-semibold">
            Plné srovnání všech 5&nbsp;dvojic
          </h2>
          <ul className="mt-4 space-y-2 text-[15px] leading-6">
            <li className="dotted pb-2">
              VOO, SPY, IVV, VTI a&nbsp;VT vedle UCITS fondů, které jsou v&nbsp;ČR dostupné
            </li>
            <li className="dotted pb-2">TER, měna, akumulace, burza, velikost fondu, registrace v&nbsp;ČR, ISIN</li>
            <li className="dotted pb-2">Daňový tahák: W-8BEN a&nbsp;časový test (obecná informace)</li>
          </ul>
          <p className="mt-3 text-[15px] font-semibold">Zobrazí se hned po odeslání, kopii pošleme e-mailem.</p>

          <form noValidate onSubmit={onSubmit} className="mt-6" aria-describedby={ids.gdpr}>
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
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? ids.error : undefined}
              className="mt-2 h-12 w-full rounded-sm border border-ink bg-card px-3 text-lg aria-invalid:border-2 aria-invalid:border-loss"
            />
            {error && (
              <p id={ids.error} role="alert" className="mt-2 text-[15px] font-semibold text-loss">
                {error}
              </p>
            )}

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

            <button
              type="submit"
              className="mt-6 flex h-14 w-full items-center justify-center rounded-sm bg-ink text-base font-semibold text-paper outline-offset-4 focus-visible:outline-2 focus-visible:outline-ink"
            >
              Zobrazit plné srovnání
            </button>

            <p id={ids.gdpr} className="mt-4 text-[13px] leading-5 text-muted">
              Správce: {orTodo(OPERATOR.name, "provozovatele")}. {CONSENT.delivery} Novinky posíláme jen se
              souhlasem výše (čl. 6 odst. 1 písm. a&nbsp;GDPR). Podrobnosti v{" "}
              <a href="/zasady" className="underline">
                zásadách ochrany osobních údajů
              </a>
              .
            </p>
          </form>
        </TrackView>
      )}
    </section>
  );
}
