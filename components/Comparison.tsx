import { LeadFormLink } from "@/components/LeadFormLink";
import { PairCard } from "@/components/PairCard";
import { PairTabs } from "@/components/PairTabs";
import { TrackView } from "@/components/TrackView";
import { lockedPairs, previewPairs } from "@/lib/etfs";

const PRIIPS_URL = "https://eur-lex.europa.eu/eli/reg/2014/1286/oj";

export function Comparison() {
  const pairs = previewPairs();
  // Výchozí VOO: navazuje na hero a reklamu B
  const initial = Math.max(
    pairs.findIndex((p) => p.us.id === "VOO"),
    0,
  );
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

      <div className="mt-6">
        <TrackView event="compare_view">
          <PairTabs
            label="Fond z NYSE"
            tabs={pairs.map((p) => ({ id: p.us.id, label: p.us.ticker.value }))}
            panels={pairs.map((p) => (
              <PairCard key={p.us.id} pair={p} />
            ))}
            initial={initial}
          />
        </TrackView>
      </div>

      <div
        className="mt-6 flex items-center justify-between gap-3 border-2 border-dashed border-ink px-4 py-3"
        data-testid="locked"
      >
        <p className="text-[15px] leading-5">
          <span className="font-semibold">V&nbsp;plné verzi navíc:</span>{" "}
          {lockedPairs()
            .map((p) => `${p.us.ticker.value} → ${p.ucits.ticker.value}`)
            .join(", ")}
        </p>
        <LeadFormLink className="shrink-0 font-semibold underline underline-offset-4">Plné srovnání →</LeadFormLink>
      </div>
    </section>
  );
}
