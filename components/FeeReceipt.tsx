import type { FeeResult } from "@/lib/fees";
import { formatDate, formatKc, formatPercent } from "@/lib/format";

/** Výsledek kalkulačky jako účtenka: vklady, náklady podle TER (s pruhy ve stejném měřítku), rozdíl ESMA. */
export function FeeReceipt({
  result,
  years,
  annualReturn,
}: {
  result: FeeResult;
  years: number;
  annualReturn: number;
}) {
  const maxCost = Math.max(...result.rows.map((r) => r.cost), 1);
  const etf = result.rows.find((r) => r.id === "esma_passive_equity_etf")!;
  const active = result.rows.find((r) => r.id === "esma_active_equity_fund")!;
  const fundSource = result.rows.find((r) => r.kind === "fund")!;

  return (
    <div className="mt-8">
      <div className="receipt bg-card px-4 text-[15px]" aria-live="polite" data-testid="receipt">
        <p className="text-center text-[13px] tracking-widest text-muted uppercase">Výpočet poplatků</p>

        <dl className="mt-3">
          <Line label="Vklady celkem" value={formatKc(result.deposits)} />
          <Line label={`Modelová hodnota bez poplatků (${annualReturn} %)`} value={formatKc(result.grossValue)} />
        </dl>

        <p className="mt-5 text-[13px] tracking-wide text-muted uppercase">
          Náklady za {years}&nbsp;let · TER ročně
        </p>
        <ul className="mt-1">
          {result.rows.map((row) => (
            <li key={row.id} className="dotted py-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <span>
                  <span className={row.kind === "fund" ? "num font-semibold" : ""}>{row.label}</span>{" "}
                  <span className="num whitespace-nowrap text-muted">{formatPercent(row.ter)}</span>
                </span>
                <span className="num font-semibold whitespace-nowrap text-loss">−{formatKc(row.cost)}</span>
              </div>
              <div aria-hidden className="mt-1.5 h-1.5 bg-paper">
                <div
                  className={row.kind === "fund" ? "h-full bg-keep" : "h-full bg-loss"}
                  style={{ width: `${Math.max((row.cost / maxCost) * 100, 0.8)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t-2 border-ink pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-semibold">
              Rozdíl {formatPercent(etf.ter)} vs. {formatPercent(active.ter)}
            </span>
            <span className="num text-xl font-semibold text-loss" data-testid="calc-gap">
              {formatKc(result.esmaGap)}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-5 text-muted">
            O tolik víc stojí průměrný aktivní akciový fond v&nbsp;EU než průměrný ETF (ESMA).
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-[13px] leading-5 text-muted">
        <p>
          <strong className="font-semibold text-ink">Náklad</strong> = zaplacené poplatky + výnos, o&nbsp;který kvůli nim
          přijdete, proti fondu bez nákladů. Kalkulačka počítá náklady, nedoporučuje žádný fond.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Modelový výpočet v&nbsp;Kč. Výnos {annualReturn}&nbsp;% je zvolený příklad, ne odhad ani slib.</li>
          <li>Nezahrnuje měnové riziko USD/CZK, poplatky brokera, směnu měn, spread ani daně.</li>
          <li>
            TER fondů od emitentů k&nbsp;{formatDate(fundSource.retrievedAt)} (zdroje u&nbsp;srovnání níže). Průměry{" "}
            <a className="underline" href={active.sourceUrl}>
              ESMA
            </a>{" "}
            za rok 2024: průběžné náklady bez vstupních poplatků.
          </li>
        </ul>
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
