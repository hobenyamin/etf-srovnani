import { LeadFormLink } from "@/components/LeadFormLink";
import { PairCard } from "@/components/PairCard";
import { PairTabs } from "@/components/PairTabs";
import { Term } from "@/components/Term";
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
    <section id="srovnani" data-reveal aria-labelledby="srovnani-h" className="scroll-mt-4 border-t border-rule px-4 py-12">
      <h2 id="srovnani-h" className="font-display text-[28px] leading-9 font-semibold">
        Fondy z&nbsp;NYSE a&nbsp;jejich evropské varianty
      </h2>
      <p className="mt-3 text-[15px] leading-6">
        Fondy se sídlem v&nbsp;USA nemají{" "}
        <Term term="KID" suffix=",">
          Sdělení klíčových informací: krátký dokument o rizicích a nákladech fondu, nejvýš 3 strany A4.
        </Term>{" "}
        který podle{" "}
        <a className="underline" href={PRIIPS_URL}>
          nařízení PRIIPs
        </a>{" "}
        musí drobný investor v&nbsp;EU dostat před nákupem. Brokeři je proto v&nbsp;Česku drobným investorům běžně
        nenabízejí. Stejný index sledují evropské fondy{" "}
        <Term term="UCITS">
          Fond podle evropské směrnice UCITS, která stanoví pravidla pro rozložení rizika a ochranu investorů.
        </Term>{" "}
        se sídlem v&nbsp;Irsku. Srovnání je informativní, nejde o&nbsp;doporučení.
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
        <LeadFormLink className="shrink-0 font-semibold text-action underline underline-offset-4">Plné srovnání →</LeadFormLink>
      </div>
    </section>
  );
}
