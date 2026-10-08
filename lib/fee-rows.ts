// Řádky účtenky z dat: TER UCITS fondů dostupných v ČR (data/etfs.json) a referenční průměry ESMA
// (data/benchmarks.json). Jen pro server – klient dostane hotové řádky jako props.
import benchmarks from "@/data/benchmarks.json";
import { ucitsFunds } from "@/lib/etfs";
import { ESMA_ACTIVE_ID, ESMA_ETF_ID, type FeeRow } from "@/lib/fees";

const esmaEtf = benchmarks.benchmarks.find((b) => b.id === ESMA_ETF_ID)!;
const esmaActive = benchmarks.benchmarks.find((b) => b.id === ESMA_ACTIVE_ID)!;

export const ESMA = {
  etfTer: esmaEtf.ter.value,
  activeTer: esmaActive.ter.value,
  sourceUrl: esmaActive.ter.source_url,
  retrievedAt: esmaActive.ter.retrieved_at,
};

function fundRows(): FeeRow[] {
  const byTer = new Map<number, FeeRow>();
  for (const fund of ucitsFunds()) {
    const row = byTer.get(fund.ter.value);
    if (row) {
      row.tickers.push(fund.ticker.value);
      continue;
    }
    byTer.set(fund.ter.value, {
      id: `ter-${fund.ter.value}`,
      label: "",
      tickers: [fund.ticker.value],
      ter: fund.ter.value,
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
    id: ESMA_ETF_ID,
    label: "Průměrný ETF v EU",
    tickers: [],
    ter: ESMA.etfTer,
    kind: "benchmark",
    sourceUrl: esmaEtf.ter.source_url,
    retrievedAt: esmaEtf.ter.retrieved_at,
  },
  {
    id: ESMA_ACTIVE_ID,
    label: "Průměrný aktivní akciový fond v EU",
    tickers: [],
    ter: ESMA.activeTer,
    kind: "benchmark",
    sourceUrl: esmaActive.ter.source_url,
    retrievedAt: esmaActive.ter.retrieved_at,
  },
];
