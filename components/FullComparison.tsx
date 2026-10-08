import { PairCard } from "@/components/PairCard";
import { fundPairs } from "@/lib/etfs";

/** Všech 5 dvojic se všemi poli – obsah za e-mail. */
export function FullComparison() {
  return (
    <>
      {fundPairs().map((pair) => (
        <PairCard key={pair.us.id} pair={pair} full />
      ))}
    </>
  );
}
