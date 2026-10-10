"use client";

import { type ReactNode, useEffect, useId, useMemo, useState } from "react";
import { FeeReceipt } from "@/components/FeeReceipt";
import { LeadFormFields, SUBMIT_CTA } from "@/components/LeadForm";
import { ThankYou } from "@/components/ThankYou";
import { TrackView } from "@/components/TrackView";
import { clampInput, DEFAULT_INPUT, LIMITS, RETURN_OPTIONS } from "@/lib/calc";
import { computeFees, type FeeRow } from "@/lib/fees";
import { formatInteger, parseAmount } from "@/lib/format";
import { calcResultShown, FORM_ANCHOR } from "@/lib/lead-flow";
import { trackOnce } from "@/lib/track";
import { useLeadFlow } from "@/lib/use-lead-flow";
import { setCalcInput } from "@/lib/visit";

const MONTHLY_PRESETS = [1000, 2000, 5000];

export function Calculator({ rows, fullComparison }: { rows: FeeRow[]; fullComparison: ReactNode }) {
  const [monthlyText, setMonthlyText] = useState(formatInteger(DEFAULT_INPUT.monthly));
  const [initialText, setInitialText] = useState(formatInteger(DEFAULT_INPUT.initial));
  const [years, setYears] = useState(DEFAULT_INPUT.years);
  const [annualReturn, setAnnualReturn] = useState(DEFAULT_INPUT.annualReturn);
  const [interacted, setInteracted] = useState(false);
  const flow = useLeadFlow();

  const input = useMemo(
    () =>
      clampInput({
        initial: parseAmount(initialText),
        monthly: parseAmount(monthlyText),
        years,
        annualReturn,
      }),
    [initialText, monthlyText, years, annualReturn],
  );
  const result = useMemo(() => computeFees(input, rows), [input, rows]);

  function touch() {
    if (!interacted) trackOnce("calc_start");
    setInteracted(true);
  }

  // calc_result: první ustálený výsledek po interakci (návštěvník přestal měnit vstupy).
  // Každý ustálený vstup se pamatuje pro formulář – k leadu se ukládá ten poslední.
  const gap = result.esmaGap;
  useEffect(() => {
    if (!interacted) return;
    const timer = setTimeout(() => {
      setCalcInput(input);
      trackOnce("calc_result", { calc_input: input, calc_result: { esma_gap: Math.round(gap) } });
      calcResultShown();
    }, 800);
    return () => clearTimeout(timer);
  }, [interacted, input, gap]);

  const ids = { monthly: useId(), initial: useId(), years: useId(), ret: useId() };

  return (
    <section id="kalkulacka" aria-labelledby="kalkulacka-h" className="scroll-mt-4 border-t border-rule px-4 py-10">
      <h2 id="kalkulacka-h" className="font-display text-2xl leading-8 font-semibold">
        Kolik vás budou stát poplatky
      </h2>
      <p className="mt-2 text-[15px] leading-6 text-muted">
        Zadejte, kolik investujete. Výsledek se přepočítá hned.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <label htmlFor={ids.monthly} className="block font-semibold">
            Měsíčně investuji
          </label>
          <AmountInput
            id={ids.monthly}
            value={monthlyText}
            max={LIMITS.monthly.max}
            onChange={(v) => {
              touch();
              setMonthlyText(v);
            }}
            onCommit={setMonthlyText}
          />
          <div className="mt-2 flex gap-2" role="group" aria-label="Rychlá volba měsíční částky">
            {MONTHLY_PRESETS.map((amount) => (
              <button
                key={amount}
                type="button"
                aria-pressed={input.monthly === amount}
                onClick={() => {
                  touch();
                  setMonthlyText(formatInteger(amount));
                }}
                className="num h-10 flex-1 rounded-sm border border-ink text-[14px] aria-pressed:border-action aria-pressed:bg-action aria-pressed:font-semibold aria-pressed:text-paper"
              >
                {formatInteger(amount)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor={ids.initial} className="block font-semibold">
            Jednorázově na začátku
          </label>
          <AmountInput
            id={ids.initial}
            value={initialText}
            max={LIMITS.initial.max}
            onChange={(v) => {
              touch();
              setInitialText(v);
            }}
            onCommit={setInitialText}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor={ids.years} className="font-semibold">
              Doba investování
            </label>
            <output htmlFor={ids.years} className="num font-semibold">
              {years}&nbsp;let
            </output>
          </div>
          <input
            id={ids.years}
            type="range"
            min={LIMITS.years.min}
            max={LIMITS.years.max}
            step={1}
            value={years}
            onChange={(e) => {
              touch();
              setYears(Number(e.target.value));
            }}
            className="mt-3 h-8 w-full accent-action"
          />
        </div>

        <fieldset aria-describedby={`${ids.ret}-note`}>
          <legend className="font-semibold">Modelový roční výnos před poplatky</legend>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {RETURN_OPTIONS.map((rate) => (
              <label
                key={rate}
                className="num flex h-11 cursor-pointer items-center justify-center rounded-sm border border-ink text-[15px] has-checked:border-action has-checked:bg-action has-checked:font-semibold has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
              >
                <input
                  type="radio"
                  name="annualReturn"
                  value={rate}
                  checked={annualReturn === rate}
                  onChange={() => {
                    touch();
                    setAnnualReturn(rate);
                  }}
                  className="sr-only"
                />
                {rate}&nbsp;%
              </label>
            ))}
          </div>
          <p id={`${ids.ret}-note`} className="mt-2 text-[13px] leading-5 text-muted">
            Zvolený příklad pro výpočet, ne odhad ani slib. Skutečný výnos může být i&nbsp;záporný.
          </p>
        </fieldset>
      </div>

      <FeeReceipt result={result} years={input.years} annualReturn={input.annualReturn}>
        <CalcLead flow={flow} fullComparison={fullComparison} />
      </FeeReceipt>
    </section>
  );
}

/**
 * Formulář hned pod výsledkem: okamžik největšího zájmu (rozhodnutí 4). Objeví se po calc_result,
 * pokud návštěvník nemá rozepsaný formulář dole. Po odeslání tady rovnou plné srovnání.
 */
function CalcLead({ flow, fullComparison }: { flow: ReturnType<typeof useLeadFlow>; fullComparison: ReactNode }) {
  if (flow.submittedAt === "calc") {
    return (
      <div id={FORM_ANCHOR.calc} className="mt-8 scroll-mt-4">
        <ThankYou delivery={flow.delivery} leadRef={flow.leadRef} headingId={`${FORM_ANCHOR.calc}-h`}>
          {fullComparison}
        </ThankYou>
      </div>
    );
  }
  if (!flow.calcDone) return null;
  if (flow.submittedAt === "bottom") {
    return (
      <p className="mt-6 font-semibold" data-testid="lead-done">
        Plné srovnání už máte.{" "}
        <a href="#formular" className="text-action underline underline-offset-4">
          Zobrazit ↓
        </a>
      </p>
    );
  }
  if (flow.activeForm !== "calc") return null;
  return (
    <div
      id={FORM_ANCHOR.calc}
      data-testid="lead-inline"
      className="mt-6 scroll-mt-4 rounded-sm border-2 border-ink bg-card p-4"
    >
      <TrackView event="form_view" props={{ form_location: "calc" }}>
        <p className="font-semibold">Chcete kompletní srovnání všech 5&nbsp;dvojic fondů NYSE ↔ UCITS?</p>
        <p className="mt-1 text-[15px] text-muted">Zobrazí se hned po odeslání, kopii pošleme e-mailem.</p>
        <LeadFormFields location="calc" submitLabel={SUBMIT_CTA} className="mt-4" />
      </TrackView>
    </div>
  );
}

type AmountInputProps = {
  id: string;
  value: string;
  max: number;
  /** Změna od návštěvníka (počítá se jako interakce) */
  onChange: (v: string) => void;
  /** Normalizace po opuštění pole (interakce se nepočítá) */
  onCommit: (v: string) => void;
};

function AmountInput({ id, value, max, onChange, onCommit }: AmountInputProps) {
  return (
    <div className="relative mt-2">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => {
          const n = parseAmount(e.target.value);
          onCommit(formatInteger(Number.isNaN(n) ? 0 : Math.min(n, max)));
        }}
        aria-describedby={`${id}-max`}
        className="num h-12 w-full rounded-sm border border-ink bg-card pr-12 pl-3 text-lg"
      />
      <span id={`${id}-max`} className="sr-only">
        Nejvýše {formatInteger(max)} Kč
      </span>
      <span aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted">
        Kč
      </span>
    </div>
  );
}
