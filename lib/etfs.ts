// Typovaný přístup k data/etfs.json. Data se nikde v UI nepřepisují ručně.
import data from "@/data/etfs.json";

export type Sourced<T> = {
  value: T;
  source_url: string;
  retrieved_at: string;
  note: string | null;
};

export type Fund = {
  id: string;
  kind: "us" | "ucits";
  ticker: Sourced<string>;
  name: Sourced<string>;
  issuer: Sourced<string>;
  isin: Sourced<string>;
  exchange: Sourced<string>;
  domicile: Sourced<string>;
  currency: Sourced<string>;
  base_currency: Sourced<string>;
  ter: Sourced<number>;
  aum: Sourced<{ amount: number; currency: string; as_of: string }>;
  distribution: Sourced<"accumulating" | "distributing">;
  index: Sourced<string>;
  registered_in_cz: Sourced<boolean | null>;
  ucits_equivalent: {
    isin: string;
    match: "same_index" | "closest";
    /** Interní poznámka – nezobrazovat */
    note: string;
    /** Krátká poznámka pro návštěvníka */
    public_note: string;
  } | null;
};

export type FundPair = { us: Fund; ucits: Fund };

export const funds = data.funds as unknown as Fund[];
export const DATA_RETRIEVED_AT = data.meta.retrieved_at;

export function ucitsFunds(): Fund[] {
  return funds.filter((f) => f.kind === "ucits");
}

/** Dvojice NYSE ETF ↔ UCITS ekvivalent v pořadí z dat. */
export function fundPairs(): FundPair[] {
  const byIsin = new Map(funds.map((f) => [f.isin.value, f]));
  return funds
    .filter((f) => f.kind === "us" && f.ucits_equivalent)
    .map((us) => ({ us, ucits: byIsin.get(us.ucits_equivalent!.isin)! }));
}

/** Dvojice se stejným indexem (ukázka zdarma) a ostatní (plná verze za e-mail). */
export function previewPairs(): FundPair[] {
  return fundPairs().filter((p) => p.us.ucits_equivalent!.match === "same_index");
}

export function lockedPairs(): FundPair[] {
  return fundPairs().filter((p) => p.us.ucits_equivalent!.match !== "same_index");
}
