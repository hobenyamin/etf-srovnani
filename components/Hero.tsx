import { TrackedLink } from "@/components/TrackedLink";
import { FEE_ROWS, ESMA } from "@/lib/fee-rows";
import { computeFees, HERO_INPUT } from "@/lib/fees";
import { fundPairs } from "@/lib/etfs";
import { formatDate, formatInteger, formatKc, formatPercent } from "@/lib/format";
import type { AdVariant } from "@/lib/track";

const cta =
  "mt-7 flex h-14 w-full items-center justify-center rounded-sm bg-ink px-6 text-base font-semibold text-paper outline-offset-4 focus-visible:outline-2 focus-visible:outline-ink";

export function Hero({ variant }: { variant: AdVariant }) {
  return (
    <header id="hero" className="px-4 pt-6 pb-10">
      <p className="text-[13px] tracking-wide text-muted uppercase">
        Srovnání ETF z NYSE · pro investory v ČR
      </p>
      {variant === "b" ? <HeroB /> : <HeroA />}
    </header>
  );
}

// A – úspora: číslo počítané živě z calc() se vstupy hero (výnos 0 %), nic natvrdo
function HeroA() {
  const gap = computeFees(HERO_INPUT, FEE_ROWS).esmaGap;
  return (
    <>
      <h1 className="mt-4 font-display text-[34px] leading-[38px] font-semibold">
        Kolik dělá rozdíl v&nbsp;poplatcích fondů za 20&nbsp;let?
      </h1>
      <p className="mt-6 text-[15px] leading-6">I bez jakéhokoli výnosu:</p>
      <p className="num text-[44px] leading-[52px] font-semibold text-loss" data-testid="hero-gap">
        {formatKc(gap)}
      </p>
      <p className="mt-1 text-[15px] leading-6">
        za {HERO_INPUT.years}&nbsp;let při {formatInteger(HERO_INPUT.monthly)}&nbsp;Kč měsíčně.
      </p>
      <p className="mt-4 border-l-2 border-rule pl-3 text-[13px] leading-5 text-muted">
        Rozdíl nákladů mezi průměrným ETF ({formatPercent(ESMA.etfTer)} ročně) a průměrným aktivním
        akciovým fondem v&nbsp;EU ({formatPercent(ESMA.activeTer)}). Zdroj:{" "}
        <a className="underline" href={ESMA.sourceUrl}>
          ESMA
        </a>
        , data za rok 2024, staženo {formatDate(ESMA.retrievedAt)}. Modelový výpočet, ne doporučení.
      </p>
      <TrackedLink href="#kalkulacka" event="hero_cta_click" eventProps={{ cta: "calc" }} className={cta}>
        Spočítat pro mě
      </TrackedLink>
    </>
  );
}

// B – zvědavost: jedno konkrétní číslo = TER dvojice VOO ↔ UCITS varianta téhož indexu z dat
function HeroB() {
  const pair = fundPairs().find((p) => p.us.id === "VOO")!;
  return (
    <>
      <h1 className="mt-4 font-display text-[34px] leading-[38px] font-semibold">
        Proč si v&nbsp;Česku nekoupíte VOO?
      </h1>
      <p className="mt-3 text-[17px] leading-7">A&nbsp;jaké alternativy jsou v&nbsp;ČR dostupné.</p>
      <p className="mt-3 text-[15px] leading-6">
        Fondům z&nbsp;USA chybí KID, který nařízení PRIIPs vyžaduje pro prodej drobným investorům v&nbsp;EU.
      </p>
      <dl className="receipt mt-6 bg-card px-4 text-[15px]">
        <div className="dotted flex items-baseline justify-between py-2">
          <dt>
            <span className="num font-semibold">{pair.us.ticker.value}</span>{" "}
            <span className="text-muted">· {pair.us.exchange.value}</span>
          </dt>
          <dd className="num">TER {formatPercent(pair.us.ter.value)}</dd>
        </div>
        <div className="flex items-baseline justify-between py-2">
          <dt>
            <span className="num font-semibold">{pair.ucits.ticker.value}</span>{" "}
            <span className="text-muted">· UCITS, {pair.ucits.domicile.value}</span>
          </dt>
          <dd className="num">TER {formatPercent(pair.ucits.ter.value)}</dd>
        </div>
        <p className="pt-1 text-[13px] leading-5 text-muted">
          Stejný index {pair.us.index.value}. Data emitentů k&nbsp;{formatDate(pair.us.ter.retrieved_at)}.
        </p>
      </dl>
      <TrackedLink href="#srovnani" event="hero_cta_click" eventProps={{ cta: "compare" }} className={cta}>
        Ukázat srovnání
      </TrackedLink>
    </>
  );
}
