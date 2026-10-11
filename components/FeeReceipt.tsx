"use client";

import { type ReactNode, useId, useState } from "react";
import { More } from "@/components/More";
import { Term } from "@/components/Term";
import type { FeeResult } from "@/lib/fees";
import { formatDate, formatKc, formatPercent } from "@/lib/format";
import { useTween } from "@/lib/use-tween";

/**
 * Výsledek kalkulačky jako účtenka: nahoře rozdíl ESMA, pod účtenkou místo pro formulář (children),
 * aby bylo číslo i pole pro e-mail vidět na jedné obrazovce. Rozpis (vklady, náklady podle TER
 * s pruhy ve stejném měřítku) je na mobilu sbalený. Předpoklady výpočtu jsou vidět vždy.
 */
export function FeeReceipt({
  result,
  years,
  annualReturn,
  children,
}: {
  result: FeeResult;
  years: number;
  annualReturn: number;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const gap = useTween(result.esmaGap);
  const breakdownId = useId();
  const maxCost = Math.max(...result.rows.map((r) => r.cost), 1);
  const etf = result.rows.find((r) => r.id === "esma_passive_equity_etf")!;
  const active = result.rows.find((r) => r.id === "esma_active_equity_fund")!;
  const fundSource = result.rows.find((r) => r.kind === "fund")!;

  return (
    <div className="mt-8">
      <div className="receipt bg-card px-4 text-[15px]" data-testid="receipt">
        <p className="text-center text-[13px] tracking-widest text-muted uppercase">Výpočet poplatků</p>

        <div className="mt-3 border-b-2 border-ink pb-3" aria-live="polite">
          <p className="font-semibold">
            Rozdíl za {years}&nbsp;let: poplatek {formatPercent(etf.ter)} vs. {formatPercent(active.ter)} ročně
          </p>
          {/* Animované číslo čtečka nečte (hlásila by každý snímek), dostane jen výslednou hodnotu.
              Šířku drží neviditelná výsledná hodnota, animovaná leží přes ni: proporcionální číslice
              by jinak měnily šířku v každém snímku, takto jen jednou při změně výsledku. */}
          <p aria-hidden className="figure font-display text-[40px] leading-[44px] font-semibold tracking-tight">
            <span className="relative inline-block">
              <span className="invisible whitespace-nowrap">{formatKc(result.esmaGap)}</span>
              <span className="absolute inset-y-0 left-0 whitespace-nowrap" data-testid="calc-gap">
                {formatKc(gap)}
              </span>
            </span>
          </p>
          <p className="sr-only">{formatKc(result.esmaGap)}</p>
          <p className="fine mt-1">
            O tolik víc stojí průměrný{" "}
            <Term term="aktivní" name="aktivní fond">Aktivní fond: akcie vybírá správce fondu, místo aby jen kopíroval index jako ETF.</Term>{" "}
            akciový fond v&nbsp;EU než průměrný ETF (ESMA).
          </p>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={breakdownId}
          onClick={() => setOpen(!open)}
          className="flex h-11 items-center font-semibold underline underline-offset-4 sm:hidden"
        >
          {open ? "Skrýt rozpis" : "Zobrazit rozpis"}
        </button>

        <div id={breakdownId} className={open ? "" : "hidden sm:block"} data-testid="receipt-breakdown">
          <dl className="mt-2">
            <Line label="Vklady celkem" value={formatKc(result.deposits)} />
            <Line label={`Kolik by investice měla bez poplatků (${annualReturn} % ročně)`} value={formatKc(result.grossValue)} />
          </dl>

          <p className="mt-5 text-[13px] tracking-wide text-muted uppercase">
            Náklady za {years}&nbsp;let · roční poplatek fondu
          </p>
          <ul className="mt-1">
            {result.rows.map((row) => (
              <li key={row.id} className="dotted py-2.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span>
                    <span className={row.kind === "fund" ? "num font-semibold" : ""}>{row.label}</span>{" "}
                    <span className="num whitespace-nowrap text-muted">{formatPercent(row.ter)}</span>
                  </span>
                  <span className="num font-semibold whitespace-nowrap">−{formatKc(row.cost)}</span>
                </div>
                {/* Dražší srovnání (průměrný aktivní fond) plný pruh, ostatní obrys: liší se tvarem, ne barvou */}
                <div aria-hidden className="mt-1.5 h-1.5">
                  <div
                    className={row.id === active.id ? "h-full bg-ink" : "h-full border-[1.5px] border-ink"}
                    style={{ width: `${Math.max((row.cost / maxCost) * 100, 0.8)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {children}

      {/* Podmínky výpočtu jsou vidět vždy, definice a zdroje jsou v rozbalovacím poli */}
      <div className="fine mt-6 space-y-1">
        <p>Kalkulačka počítá náklady, nedoporučuje žádný fond.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Modelový výpočet v&nbsp;Kč. Výnos {annualReturn}&nbsp;% je zvolený příklad, ne odhad ani slib.</li>
          <li>
            Nezahrnuje změny kurzu koruny, poplatky brokera, směnu měn, rozdíl mezi nákupní a&nbsp;prodejní cenou ani
            daně.
          </li>
        </ul>
        <More summary="Jak počítáme">
          <p>
            Do <strong className="font-semibold text-ink">nákladů</strong> počítáme zaplacené poplatky i&nbsp;výnos, který
            by tyto peníze vydělaly, kdyby zůstaly investované.
          </p>
          <p className="mt-1">
            Roční poplatky (TER) fondů od jejich správců k&nbsp;{formatDate(fundSource.retrievedAt)} (zdroje u&nbsp;srovnání níže). Průměry{" "}
            <a className="underline" href={active.sourceUrl}>
              ESMA
            </a>{" "}
            za rok 2024 (staženo {formatDate(active.retrievedAt)}): jen roční poplatky, bez vstupních poplatků.
          </p>
        </More>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="dotted flex items-baseline justify-between gap-3 py-2">
      <dt>{label}</dt>
      <dd className="num whitespace-nowrap">{value}</dd>
    </div>
  );
}
