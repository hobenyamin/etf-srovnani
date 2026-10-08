import { describe, expect, it } from "vitest";
import { type CalcInput, clampInput, feeCost, futureValue, totalDeposits } from "./calc";
import { computeFees, ESMA, FEE_ROWS, HERO_INPUT } from "./fees";

const base: CalcInput = { initial: 0, monthly: 2000, years: 20, annualReturn: 5 };

describe("futureValue", () => {
  it("bez výnosu a bez nákladů vrátí součet vkladů", () => {
    const input = { initial: 50_000, monthly: 3000, years: 15, annualReturn: 0 };
    expect(futureValue(input, 0)).toBeCloseTo(50_000 + 3000 * 12 * 15, 6);
    expect(totalDeposits(input)).toBe(590_000);
  });

  it("jednorázový vklad odpovídá uzavřenému vzorci P·(1+r)^n·(1−TER)^n", () => {
    const input = { initial: 100_000, monthly: 0, years: 20, annualReturn: 5 };
    expect(futureValue(input, 1)).toBeCloseTo(100_000 * 1.05 ** 20 * 0.99 ** 20, 6);
  });
});

describe("feeCost", () => {
  it("TER 0 → náklad 0", () => {
    expect(feeCost(base, 0)).toBe(0);
  });

  it("roste s TER, horizontem i vkladem", () => {
    expect(feeCost(base, 0.07)).toBeGreaterThan(feeCost(base, 0.03));
    expect(feeCost({ ...base, years: 25 }, 0.07)).toBeGreaterThan(feeCost(base, 0.07));
    expect(feeCost({ ...base, monthly: 3000 }, 0.07)).toBeGreaterThan(feeCost(base, 0.07));
    expect(feeCost({ ...base, initial: 10_000 }, 0.07)).toBeGreaterThan(feeCost(base, 0.07));
  });
});

describe("clampInput", () => {
  it("ořízne záporné, příliš velké a neplatné vstupy", () => {
    expect(clampInput({ initial: -5, monthly: 1e9, years: 2, annualReturn: NaN })).toEqual({
      initial: 0,
      monthly: 50_000,
      years: 5,
      annualReturn: 0,
    });
    expect(clampInput({ initial: 0, monthly: 0, years: 40, annualReturn: 99 }).years).toBe(30);
  });

  it("neplatný vstup se počítá jako minimum, ne jako NaN", () => {
    expect(futureValue({ ...base, monthly: Number("") }, 0.07)).toBe(0);
    expect(Number.isNaN(feeCost({ ...base, initial: Number("abc") }, 0.07))).toBe(false);
  });
});

// Regrese: čísla z hero a z reklamy A. Když se změní, musí se změnit i texty.
describe("tvrzení reklamy A (ESMA 0,2 % vs. 1,2 %)", () => {
  it("benchmarky se načítají z data/benchmarks.json", () => {
    expect(ESMA.etfTer).toBe(0.2);
    expect(ESMA.activeTer).toBe(1.2);
  });

  it("hero: 2 000 Kč, 20 let, výnos 0 % → 44 246 Kč", () => {
    expect(Math.round(computeFees(HERO_INPUT).esmaGap)).toBe(44_246);
  });

  it("kalkulačka: 2 000 Kč, 20 let, 5 % → rozdíl 86 478 Kč, náklad 1,2 % = 105 202 Kč", () => {
    const result = computeFees(base);
    expect(Math.round(result.esmaGap)).toBe(86_478);
    expect(Math.round(result.rows.find((r) => r.ter === 1.2)!.cost)).toBe(105_202);
  });
});

describe("řádky účtenky", () => {
  it("fondy z dat jsou jen UCITS seskupené podle TER, pak dva referenční řádky", () => {
    const funds = FEE_ROWS.filter((r) => r.kind === "fund");
    expect(funds.map((r) => [r.ter, r.tickers])).toEqual([
      [0.03, ["SPYL", "SXR4"]],
      [0.07, ["VUAA", "SXR8"]],
      [0.14, ["VWCE"]],
    ]);
    expect(FEE_ROWS.slice(-2).map((r) => r.ter)).toEqual([0.2, 1.2]);
  });
});
