import { PairCard } from "@/components/PairCard";
import { PairTabs } from "@/components/PairTabs";
import { fundPairs } from "@/lib/etfs";

/**
 * Všech 5 dvojic se všemi poli – obsah za e-mail. Přepínač jako v ukázce srovnání, výchozí VOO.
 * Všechny karty jsou v HTML (vykreslené na serveru), přepínač jen skrývá.
 */
export function FullComparison() {
  const pairs = fundPairs();
  return (
    <div>
      <PairTabs
        label="Fond z NYSE, plné srovnání"
        tabs={pairs.map((p) => ({ id: p.us.id, label: p.us.ticker.value }))}
        panels={pairs.map((p) => (
          <PairCard key={p.us.id} pair={p} full />
        ))}
        initial={Math.max(
          pairs.findIndex((p) => p.us.id === "VOO"),
          0,
        )}
        columns={5}
        panelClassName="rounded-sm bg-card px-3 py-4"
      />
    </div>
  );
}
