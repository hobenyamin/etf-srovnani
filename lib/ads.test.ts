// Reklamy (ads/) musí tvrdit totéž co hero. Čísla v textech a vizuálech se kontrolují proti výpočtu
// a datům, ze kterých stránka hero skládá – když se data změní, test spadne dřív, než reklama začne lhát.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { fundPairs } from "./etfs";
import { ESMA, FEE_ROWS } from "./fee-rows";
import { computeFees, HERO_INPUT } from "./fees";
import { formatInteger, formatKc, formatPercent } from "./format";

type Copy = {
  variant: "a" | "b";
  primary_text: string[];
  headline: string;
  description: string;
  cta: string;
  url: string;
};

/** Část primárního textu viditelná před „Zobrazit více“ (Meta Ads Guide: primární text 125 znaků) */
const VISIBLE = 125;
/** Nadpis: Meta Ads Guide, Instagram feed 40 znaků (Facebook feed doporučuje 27) */
const HEADLINE_MAX = 40;

const read = (...path: string[]) => readFileSync(join(process.cwd(), "ads", ...path), "utf8");
const copy = (dir: string): Copy => JSON.parse(read(dir, "copy.json"));

// Mezery v HTML (&nbsp;) i z Intl (U+00A0, U+202F) sjednotit na obyčejné
const plain = (s: string) => s.replace(/&nbsp;/g, " ").replace(/[  ]/g, " ").replace(/&amp;/g, "&");

const gap = plain(formatKc(computeFees(HERO_INPUT, FEE_ROWS).esmaGap));
const monthly = plain(`${formatInteger(HERO_INPUT.monthly)} Kč`);
const pct = (value: number) => plain(formatPercent(value));

describe.each(["a-uspora", "b-zvedavost"])("reklama %s", (dir) => {
  const c = copy(dir);

  it("upozornění „ne doporučení“ je vidět před „Zobrazit více“", () => {
    expect(c.primary_text[0].length).toBeLessThanOrEqual(VISIBLE);
    expect(c.primary_text.join("\n\n").slice(0, VISIBLE)).toContain("ne doporučení");
  });

  it("nadpis se vejde do limitu Meta", () => {
    expect(c.headline.length).toBeLessThanOrEqual(HEADLINE_MAX);
  });

  it("utm_content vybere v proxy.ts hero stejné varianty", () => {
    const content = new URL(c.url).searchParams.get("utm_content") ?? "";
    expect(content.toLowerCase().startsWith("b")).toBe(c.variant === "b");
  });

  it("README varianty obsahuje přesně texty z copy.json", () => {
    const readme = read(dir, "README.md");
    for (const text of [...c.primary_text, c.headline, c.description, c.cta, c.url]) {
      expect(readme).toContain(text);
    }
  });
});

describe("reklama A sedí s hero A", () => {
  const c = copy("a-uspora");
  const html = plain(read("a-uspora", "ad.html"));

  it("podmínka (částka a horizont) je v prvních 125 znacích primárního textu", () => {
    const visible = plain(c.primary_text[0]);
    expect(visible).toContain(`Při ${monthly} měsíčně`);
    expect(visible).toContain(`za ${HERO_INPUT.years} let`);
  });

  it("„přes 40 000 Kč“ platí pro číslo z hero", () => {
    expect(plain(c.primary_text[0])).toContain("přes 40 000 Kč");
    expect(computeFees(HERO_INPUT, FEE_ROWS).esmaGap).toBeGreaterThan(40_000);
  });

  it("nadpis: číslo z hero až po podmínce", () => {
    const headline = plain(c.headline);
    expect(headline).toContain(gap);
    expect(headline.indexOf(monthly)).toBeLessThan(headline.indexOf(gap));
    expect(headline).toContain(`${HERO_INPUT.years} let`);
  });

  it("disclaimer má číslo i průměry ESMA jako hero", () => {
    const disclaimer = plain(c.primary_text.join(" "));
    expect(disclaimer).toContain(gap);
    expect(disclaimer).toContain(`ETF (${pct(ESMA.etfTer)})`);
    expect(disclaimer).toContain(`(${pct(ESMA.activeTer)})`);
  });

  it("vizuál: číslo z hero, podmínka hned pod ním, průměry ESMA", () => {
    expect(HERO_INPUT.annualReturn).toBe(0);
    expect(html).toContain(gap);
    expect(html).toMatch(new RegExp(`${gap}</p>\\s*<p class="cond">rozdíl při ${monthly} měsíčně za ${HERO_INPUT.years} let, výnos 0 %`));
    expect(html).toContain(pct(ESMA.activeTer));
    expect(html).toContain(pct(ESMA.etfTer));
    expect(html).toContain("ESMA");
    expect(html).toContain("ne doporučení");
  });
});

describe("reklama B sedí s hero B", () => {
  const c = copy("b-zvedavost");
  const html = plain(read("b-zvedavost", "ad.html"));

  it("otázka a podnadpis doslova jako v hero", () => {
    expect(c.headline).toBe("Proč si v Česku nekoupíte VOO?");
    expect(c.primary_text[0]).toMatch(/^Proč si v Česku nekoupíte VOO\? A jaké alternativy jsou v ČR dostupné\./);
    expect(html).toContain("Proč si v Česku nekoupíte VOO?");
    expect(html).toContain("A jaké alternativy jsou v ČR dostupné.");
  });

  it("nejmenuje konkrétní UCITS fond", () => {
    const ucitsTickers = FEE_ROWS.flatMap((r) => r.tickers);
    const all = `${c.primary_text.join(" ")} ${c.headline} ${c.description} ${html}`;
    for (const ticker of ucitsTickers) expect(all).not.toMatch(new RegExp(`\\b${ticker}\\b`));
  });

  it("ticker a burza ve vizuálu odpovídají data/etfs.json (VOO s písmenem O, ne V00)", () => {
    const voo = fundPairs().find((p) => p.us.id === "VOO")!.us;
    const match = html.match(/<span class="ticker" data-ticker>([^<]+)<\/span> · ([^<]+)<span/);
    expect(match).not.toBeNull();
    expect(match![1]).toBe(voo.ticker.value);
    expect(match![2]).toBe(voo.exchange.value);
    expect(`${html} ${c.primary_text.join(" ")} ${c.headline}`).not.toMatch(/V00/);
  });

  it("ticker není v monospace (.num), kde „O“ vypadá jako nula", () => {
    expect(html).not.toMatch(/class="num">VOO</);
  });

  it("vizuál má upozornění", () => {
    expect(html).toContain("ne doporučení");
  });
});
