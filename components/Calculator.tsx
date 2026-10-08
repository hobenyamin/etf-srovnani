"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { FeeReceipt } from "@/components/FeeReceipt";
import { clampInput, DEFAULT_INPUT, LIMITS, RETURN_OPTIONS } from "@/lib/calc";
import { computeFees, type FeeRow } from "@/lib/fees";
import { formatInteger, parseAmount } from "@/lib/format";
import { trackOnce } from "@/lib/track";

const MONTHLY_PRESETS = [1000, 2000, 5000];

export function Calculator({ rows }: { rows: FeeRow[] }) {
  const [monthlyText, setMonthlyText] = useState(formatInteger(DEFAULT_INPUT.monthly));
  const [initialText, setInitialText] = useState(formatInteger(DEFAULT_INPUT.initial));
  const [years, setYears] = useState(DEFAULT_INPUT.years);
  const [annualReturn, setAnnualReturn] = useState(DEFAULT_INPUT.annualReturn);
  const [interacted, setInteracted] = useState(false);
  const [resultShown, setResultShown] = useState(false);

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

  // calc_result: první ustálený výsledek po interakci (návštěvník přestal měnit vstupy)
  const gap = result.esmaGap;
  useEffect(() => {
    if (!interacted) return;
    const timer = setTimeout(() => {
      trackOnce("calc_result", { calc_input: input, calc_result: { esma_gap: Math.round(gap) } });
      setResultShown(true);
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
                className="num h-10 flex-1 rounded-sm border border-ink text-[14px] aria-pressed:bg-ink aria-pressed:text-paper"
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
            className="mt-3 h-8 w-full accent-ink"
          />
        </div>

        <fieldset aria-describedby={`${ids.ret}-note`}>
          <legend className="font-semibold">Modelový roční výnos před poplatky</legend>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {RETURN_OPTIONS.map((rate) => (
              <label
                key={rate}
                className="num flex h-11 cursor-pointer items-center justify-center rounded-sm border border-ink text-[15px] has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
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

      <FeeReceipt result={result} years={input.years} annualReturn={input.annualReturn} />

      {resultShown && (
        <a
          href="#formular"
          data-testid="lead-offer"
          className="mt-6 block rounded-sm border-2 border-ink bg-card p-4 outline-offset-4 focus-visible:outline-2"
        >
          <span className="block font-semibold">
            Chcete kompletní srovnání všech 5&nbsp;dvojic fondů NYSE ↔ UCITS?
          </span>
          <span className="mt-1 block text-[15px] text-muted">Zobrazí se hned po zadání e-mailu →</span>
        </a>
      )}
    </section>
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
