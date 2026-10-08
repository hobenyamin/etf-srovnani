import { PairCard } from "@/components/PairCard";
import { TrackView } from "@/components/TrackView";
import { lockedPairs, previewPairs } from "@/lib/etfs";

const PRIIPS_URL = "https://eur-lex.europa.eu/eli/reg/2014/1286/oj";

export function Comparison() {
  const [first, ...rest] = previewPairs();
  return (
    <section id="srovnani" aria-labelledby="srovnani-h" className="scroll-mt-4 border-t border-rule px-4 py-10">
      <h2 id="srovnani-h" className="font-display text-2xl leading-8 font-semibold">
        Fondy z&nbsp;NYSE a&nbsp;jejich evropské varianty
      </h2>
      <p className="mt-3 text-[15px] leading-6">
        Fondy domicilované v&nbsp;USA nemají sdělení klíčových informací (KID), které pro prodej drobným investorům
        v&nbsp;EU vyžaduje{" "}
        <a className="underline" href={PRIIPS_URL}>
          nařízení PRIIPs
        </a>
        . Brokeři je proto drobným investorům v&nbsp;Česku běžně nenabízejí. Stejný index sledují fondy UCITS
        z&nbsp;Irska. Srovnání je informativní, nejde o&nbsp;doporučení.
      </p>

      <div className="mt-8 space-y-8">
        <TrackView event="compare_view">
          <PairCard pair={first} />
        </TrackView>
        {rest.map((pair) => (
          <PairCard key={pair.us.id} pair={pair} />
        ))}
      </div>

      <div className="mt-8 border-2 border-dashed border-ink p-4" data-testid="locked">
        <p className="font-semibold">
          V&nbsp;plné verzi navíc:{" "}
          {lockedPairs()
            .map((p) => `${p.us.ticker.value} → ${p.ucits.ticker.value}`)
            .join(", ")}
        </p>
        <p className="mt-1 text-[15px] leading-6 text-muted">
          Celý americký trh a&nbsp;celý svět: nejbližší UCITS alternativy a&nbsp;v&nbsp;čem se od originálu liší. Plus
          velikost fondů, registrace v&nbsp;ČR a&nbsp;ISIN u&nbsp;všech dvojic.
        </p>
        <a href="#formular" className="mt-3 inline-block font-semibold underline underline-offset-4">
          Zobrazit plné srovnání →
        </a>
      </div>
    </section>
  );
}
