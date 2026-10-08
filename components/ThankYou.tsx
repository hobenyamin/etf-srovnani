"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/track";

const BROKER_ANSWERS = ["Ano", "Ne", "Zvažuji"] as const;

/** Děkovací stav: slíbený obsah hned na stránce, ne „čekejte na e-mail“. Jedna nepovinná otázka. */
export function ThankYou({ children }: { children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const questionId = useId();

  useEffect(() => {
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div data-testid="thank-you">
      <h2 ref={heading} tabIndex={-1} id="formular-h" className="font-display text-2xl leading-8 font-semibold outline-none">
        Hotovo. Tady je plné srovnání.
      </h2>
      <p className="mt-2 text-[15px] leading-6 text-muted">
        Kopii vám pošleme e-mailem. Potvrďte prosím adresu odkazem, který vám přijde.
      </p>

      <div className="mt-8 space-y-8">{children}</div>

      <section aria-labelledby="dane-h" className="mt-10 border-t-2 border-ink pt-3">
        <h3 id="dane-h" className="font-display text-xl font-semibold">
          Daňový tahák
        </h3>
        {/* Krok 5 (texty): obsah W-8BEN a časového testu se zdroji, po kontrole. */}
        <p className="mt-2 text-[15px] leading-6">
          Tahák k&nbsp;formuláři W-8BEN a&nbsp;časovému testu právě prochází kontrolou. Pošleme vám ho e-mailem, jakmile
          bude hotový.
        </p>
      </section>

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
            {BROKER_ANSWERS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  // Krok 4: uložit k leadu
                  track("qualify_answer", { has_broker: a });
                  setAnswer(a);
                }}
                className="h-11 rounded-sm border border-ink text-[15px]"
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}
