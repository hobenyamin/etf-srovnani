// Výpočet řádků účtenky poplatků. Bez importu dat, aby šel do klientského bundlu
// (řádky sestaví server v lib/fee-rows.ts). Řádky jen ukazují náklad podle TER – nic nedoporučují.
import { type CalcInput, feeCost, futureValue, totalDeposits } from "@/lib/calc";

export const ESMA_ETF_ID = "esma_passive_equity_etf";
export const ESMA_ACTIVE_ID = "esma_active_equity_fund";

export type FeeRow = {
  id: string;
  label: string;
  /** Tickery fondů s tímto TER, prázdné u referenčních řádků */
  tickers: string[];
  /** TER v % ročně (0.07 = 0,07 %) */
  ter: number;
  kind: "fund" | "benchmark";
  sourceUrl: string;
  retrievedAt: string;
};

export type FeeResult = {
  deposits: number;
  /** Modelová hodnota bez jakýchkoli nákladů */
  grossValue: number;
  rows: (FeeRow & { cost: number })[];
  /** Náklad průměrného aktivního fondu − náklad průměrného ETF (oba ESMA). Číslo z hero. */
  esmaGap: number;
};

/** Vstupy čísla v hero varianty A: 2 000 Kč měsíčně, 20 let, výnos 0 %. */
export const HERO_INPUT: CalcInput = { initial: 0, monthly: 2000, years: 20, annualReturn: 0 };

export function computeFees(input: CalcInput, feeRows: FeeRow[]): FeeResult {
  const rows = feeRows.map((row) => ({ ...row, cost: feeCost(input, row.ter) }));
  const cost = (id: string) => rows.find((r) => r.id === id)?.cost ?? NaN;
  return {
    deposits: totalDeposits(input),
    grossValue: futureValue(input, 0),
    rows,
    esmaGap: cost(ESMA_ACTIVE_ID) - cost(ESMA_ETF_ID),
  };
}
