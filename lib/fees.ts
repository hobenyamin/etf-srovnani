// Řádky účtenky poplatků: TER z data/etfs.json (UCITS fondy dostupné v ČR) a referenční průměry ESMA.
// Řádky jen ukazují náklad podle TER – nic nedoporučují.
import benchmarks from "@/data/benchmarks.json";
import { ucitsFunds } from "@/lib/etfs";
import { type CalcInput, feeCost, futureValue, totalDeposits } from "@/lib/calc";

export type FeeRow = {
  id: string;
  label: string;
  /** Tickery fondů s tímto TER, prázdné u referenčních řádků */
  tickers: string[];
  ter: number;
  kind: "fund" | "benchmark";
  sourceUrl: string;
  retrievedAt: string;
};

export type FeeResult = {
  input: CalcInput;
  deposits: number;
  /** Hodnota bez jakýchkoli nákladů */
  grossValue: number;
  rows: (FeeRow & { cost: number; value: number })[];
  /** Rozdíl nákladů: průměrný aktivní fond (ESMA) − průměrný ETF (ESMA). Číslo z hero. */
  esmaGap: number;
};

const ESMA_ETF = benchmarks.benchmarks.find((b) => b.id === "esma_passive_equity_etf")!;
const ESMA_ACTIVE = benchmarks.benchmarks.find((b) => b.id === "esma_active_equity_fund")!;

export const ESMA = {
  etfTer: ESMA_ETF.ter.value,
  activeTer: ESMA_ACTIVE.ter.value,
  sourceUrl: ESMA_ACTIVE.ter.source_url,
  retrievedAt: ESMA_ACTIVE.ter.retrieved_at,
};

function fundRows(): FeeRow[] {
  const byTer = new Map<number, FeeRow>();
  for (const fund of ucitsFunds()) {
    const ter = fund.ter.value;
    const row = byTer.get(ter);
    if (row) {
      row.tickers.push(fund.ticker.value);
      continue;
    }
    byTer.set(ter, {
      id: `ter-${ter}`,
      label: "",
      tickers: [fund.ticker.value],
      ter,
      kind: "fund",
      sourceUrl: fund.ter.source_url,
      retrievedAt: fund.ter.retrieved_at,
    });
  }
  return [...byTer.values()]
    .sort((a, b) => a.ter - b.ter)
    .map((row) => ({ ...row, label: row.tickers.join(", ") }));
}

export const FEE_ROWS: FeeRow[] = [
  ...fundRows(),
  {
    id: ESMA_ETF.id,
    label: "Průměrný ETF v EU (ESMA)",
    tickers: [],
    ter: ESMA.etfTer,
    kind: "benchmark",
    sourceUrl: ESMA_ETF.ter.source_url,
    retrievedAt: ESMA_ETF.ter.retrieved_at,
  },
  {
    id: ESMA_ACTIVE.id,
    label: "Průměrný aktivní akciový fond v EU (ESMA)",
    tickers: [],
    ter: ESMA.activeTer,
    kind: "benchmark",
    sourceUrl: ESMA_ACTIVE.ter.source_url,
    retrievedAt: ESMA_ACTIVE.ter.retrieved_at,
  },
];

export function computeFees(input: CalcInput): FeeResult {
  const grossValue = futureValue(input, 0);
  const rows = FEE_ROWS.map((row) => ({
    ...row,
    cost: feeCost(input, row.ter),
    value: futureValue(input, row.ter),
  }));
  return {
    input,
    deposits: totalDeposits(input),
    grossValue,
    rows,
    esmaGap: feeCost(input, ESMA.activeTer) - feeCost(input, ESMA.etfTer),
  };
}

/** Vstupy čísla v hero varianty A: 2 000 Kč měsíčně, 20 let, výnos 0 %. */
export const HERO_INPUT: CalcInput = { initial: 0, monthly: 2000, years: 20, annualReturn: 0 };
