"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { saveQualify } from "@/app/actions/lead";
import { DoneBanner } from "@/components/DoneBanner";
import { QUALIFY_ANSWERS } from "@/lib/lead";
import type { Delivery } from "@/lib/lead-flow";
import { track } from "@/lib/track";

/** Děkovací stav: slíbený obsah hned na stránce, ne „čekejte na e-mail“. Jedna nepovinná otázka. */
export function ThankYou({
  delivery,
  leadRef,
  headingId = "formular-h",
  children,
}: {
  delivery: Delivery;
  leadRef: string | null;
  /** Na stránce jsou dvě místa formuláře, každé s vlastním nadpisem */
  headingId?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const questionId = useId();

  useEffect(() => {
    // Focus na nadpis, posun na začátek bloku, aby byla vidět i ikona nad nadpisem
    heading.current?.focus({ preventScroll: true });
    root.current?.scrollIntoView({ block: "start" });
  }, []);

  // Odpověď se uloží, jakmile je známý lead – i když návštěvník odpoví dřív, než server odpoví.
  useEffect(() => {
    if (answer && leadRef) saveQualify(leadRef, answer).catch(() => {});
  }, [answer, leadRef]);

  return (
    <div ref={root} data-testid="thank-you" className="scroll-mt-4">
      <DoneBanner title="Hotovo." headingId={headingId} headingRef={heading}>
        <p className="font-semibold text-paper">Plné srovnání máte hned pod tímto rámečkem.</p>
        <p className="mt-1" role="status" data-testid="delivery">
          {delivery === "pending" ? (
            <>
              <span aria-hidden className="pulse-dot mr-2" />
              Ukládáme adresu…
            </>
          ) : delivery === "failed"
            ? "E-mail se nám teď nepodařilo zpracovat, kopie proto nepřijde. Srovnání máte celé tady na stránce."
            : delivery === "confirmed"
              ? "Tuto adresu už máte potvrzenou, odkaz na srovnání najdete v dřívějším e-mailu."
              : "Kopii vám pošleme e-mailem. Potvrďte prosím adresu odkazem, který vám přijde."}
        </p>
      </DoneBanner>

      <div className="mt-8 space-y-8">{children}</div>

      <fieldset className="mt-10 rounded-sm bg-card p-4" aria-describedby={questionId}>
        <legend className="float-left font-semibold">Máte už účet u&nbsp;brokera?</legend>
        <p id={questionId} className="clear-left text-[13px] text-muted">
          Nepovinné. Pomůže nám vybrat, co dalšího připravit.
        </p>
        {answer ? (
          <p className="mt-3 text-[15px]" role="status">
            Díky za odpověď.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {QUALIFY_ANSWERS.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => {
                  track("qualify_answer", { has_broker: a.value });
                  setAnswer(a.value);
                }}
                className="press h-11 rounded-sm border border-ink text-[15px]"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}
