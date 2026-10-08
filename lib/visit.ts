// Stav jedné návštěvy stránky (jen v paměti, nic se neukládá do zařízení): varianta reklamy,
// UTM z URL a poslední ustálený vstup kalkulačky. Čte ho měření (track.ts) i formulář.
import type { CalcInput } from "@/lib/calc";

export type AdVariant = "a" | "b";

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

let adVariant: AdVariant = "a";
let calcInput: CalcInput | null = null;

export function setAdVariant(variant: AdVariant) {
  adVariant = variant;
}

export function getAdVariant(): AdVariant {
  return adVariant;
}

/** Vstup kalkulačky, u kterého návštěvník zůstal (null = kalkulačku nepoužil). */
export function setCalcInput(input: CalcInput) {
  calcInput = input;
}

export function getCalcInput(): CalcInput | null {
  return calcInput;
}

export function utmFromUrl(): Utm {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}
