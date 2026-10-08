// Výpočet nákladů poplatků fondu. Čistá matematika bez dat a bez doporučení.
//
// Měsíční krok: vklad na začátku měsíce, zhodnocení, pak odečet průběžných nákladů
// (TER se strhává průběžně z majetku fondu):
//   r_m = (1 + r)^(1/12) − 1
//   f_m = (1 − TER)^(1/12)
//   B_0 = P,  B_k = (B_{k−1} + m) · (1 + r_m) · f_m
// Náklad = B(TER = 0) − B(TER): zaplacené poplatky i výnos, o který kvůli nim investor přijde.

export type CalcInput = {
  /** Jednorázový vklad v Kč */
  initial: number;
  /** Měsíční vklad v Kč */
  monthly: number;
  /** Horizont v letech */
  years: number;
  /** Modelový roční výnos před poplatky v % (5 = 5 %) */
  annualReturn: number;
};

export const LIMITS = {
  initial: { min: 0, max: 2_000_000 },
  monthly: { min: 0, max: 50_000 },
  years: { min: 5, max: 30 },
  annualReturn: { min: 0, max: 7 },
} as const;

export const RETURN_OPTIONS = [0, 3, 5, 7] as const;

export const DEFAULT_INPUT: CalcInput = {
  initial: 0,
  monthly: 2000,
  years: 20,
  annualReturn: 5,
};

function clamp(value: number, { min, max }: { min: number; max: number }): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Ořízne vstupy na povolené rozsahy; NaN a nečísla → minimum. Roky celé číslo. */
export function clampInput(input: CalcInput): CalcInput {
  return {
    initial: clamp(input.initial, LIMITS.initial),
    monthly: clamp(input.monthly, LIMITS.monthly),
    years: Math.round(clamp(input.years, LIMITS.years)),
    annualReturn: clamp(input.annualReturn, LIMITS.annualReturn),
  };
}

/** Hodnota investice na konci horizontu po odečtení průběžných nákladů. `terPercent` v % (0.07 = 0,07 %). */
export function futureValue(input: CalcInput, terPercent: number): number {
  const { initial, monthly, years, annualReturn } = clampInput(input);
  const growth = Math.pow(1 + annualReturn / 100, 1 / 12);
  const keep = Math.pow(1 - terPercent / 100, 1 / 12);
  let balance = initial;
  for (let month = 0; month < years * 12; month++) {
    balance = (balance + monthly) * growth * keep;
  }
  return balance;
}

/** Kolik investora za horizont stojí daný TER proti fondu bez nákladů (v Kč, nezaokrouhleno). */
export function feeCost(input: CalcInput, terPercent: number): number {
  return futureValue(input, 0) - futureValue(input, terPercent);
}

/** Součet vkladů v Kč. */
export function totalDeposits(input: CalcInput): number {
  const { initial, monthly, years } = clampInput(input);
  return initial + monthly * 12 * years;
}
