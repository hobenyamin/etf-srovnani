// České formátování čísel a dat. Částky v Kč zaokrouhlujeme na stovky – víc přesnosti model nemá.

const integer = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 4 });

/** 44245.5 → „44 200 Kč“ (nezlomitelné mezery) */
export function formatKc(amount: number): string {
  return `${integer.format(Math.round(amount / 100) * 100)} Kč`;
}

/** Vstup bez zaokrouhlení na stovky: 2000 → „2 000“ */
export function formatInteger(value: number): string {
  return integer.format(value);
}

/** 0.07 → „0,07 %“ */
export function formatPercent(value: number): string {
  return `${percent.format(value)} %`;
}

/** „2026-10-08“ → „8. 10. 2026“ */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}

/** 897204689814 USD → „897 mld. USD“ */
export function formatBillions(amount: number, currency: string): string {
  return `${integer.format(Math.round(amount / 1e9))} mld. ${currency}`;
}

/** Parsování vstupu z textového pole: „2 000 Kč“ → 2000; nečíslo → NaN */
export function parseAmount(text: string): number {
  const digits = text.replace(/[^\d]/g, "");
  return digits === "" ? NaN : Number(digits);
}
