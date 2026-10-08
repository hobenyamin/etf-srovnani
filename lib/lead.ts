// Vstup formuláře: validace sdílená prohlížečem i serverem. Bez dat a bez tajemství,
// aby šla do klientského bundlu. Server nevěří ničemu, co přijde z prohlížeče.
import { type CalcInput, clampInput } from "@/lib/calc";
import { type AdVariant, UTM_KEYS, type Utm } from "@/lib/visit";

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const EMAIL_MAX = 254;
export const UTM_MAX = 200;
/** Odeslání dřív než za tuto dobu od zobrazení formuláře považujeme za robota. */
export const MIN_FILL_MS = 2000;

export const QUALIFY_ANSWERS = [
  { label: "Ano", value: "ano" },
  { label: "Ne", value: "ne" },
  { label: "Zvažuji", value: "zvazuji" },
] as const;
export type QualifyAnswer = (typeof QUALIFY_ANSWERS)[number]["value"];

/** Co posílá formulář serveru. */
export type LeadPayload = {
  email: string;
  marketing: boolean;
  adVariant: AdVariant;
  utm: Utm;
  calcInput: CalcInput | null;
  /** Honeypot – člověk ho nevidí, musí zůstat prázdný */
  website: string;
  /** Jak dlouho byl formulář zobrazený před odesláním */
  elapsedMs: number;
};

export type ParsedLead = {
  email: string;
  marketing: boolean;
  adVariant: AdVariant;
  utm: Utm;
  calcInput: CalcInput | null;
};

export type ParseResult =
  | { ok: true; lead: ParsedLead; bot: boolean }
  | { ok: false; error: "email" | "invalid" };

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return email.length <= EMAIL_MAX && EMAIL.test(email);
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function parseUtm(raw: unknown): Utm {
  if (!isRecord(raw)) return {};
  const out: Utm = {};
  for (const key of UTM_KEYS) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim().slice(0, UTM_MAX);
  }
  return out;
}

function parseCalcInput(raw: unknown): CalcInput | null {
  if (!isRecord(raw)) return null;
  const num = (v: unknown) => (typeof v === "number" ? v : Number.NaN);
  return clampInput({
    initial: num(raw.initial),
    monthly: num(raw.monthly),
    years: num(raw.years),
    annualReturn: num(raw.annualReturn),
  });
}

/** Validace na serveru. `bot` = vyplněný honeypot nebo příliš rychlé odeslání (odpovíme stejně, neuložíme). */
export function parseLeadInput(raw: unknown): ParseResult {
  if (!isRecord(raw) || typeof raw.email !== "string") return { ok: false, error: "invalid" };
  const email = normalizeEmail(raw.email);
  if (!isValidEmail(email)) return { ok: false, error: "email" };

  const website = typeof raw.website === "string" ? raw.website : "";
  const elapsedMs = typeof raw.elapsedMs === "number" ? raw.elapsedMs : 0;

  return {
    ok: true,
    bot: website.trim() !== "" || !(elapsedMs >= MIN_FILL_MS),
    lead: {
      email,
      marketing: raw.marketing === true,
      adVariant: raw.adVariant === "b" ? "b" : "a",
      utm: parseUtm(raw.utm),
      calcInput: parseCalcInput(raw.calcInput),
    },
  };
}
