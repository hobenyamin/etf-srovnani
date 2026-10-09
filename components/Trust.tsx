import { DATA_RETRIEVED_AT } from "@/lib/etfs";
import { ESMA } from "@/lib/fee-rows";
import { formatDate } from "@/lib/format";
import { OPERATOR, RISK_WARNINGS } from "@/lib/site";

export function Trust() {
  return (
    <section aria-labelledby="duvera-h" className="border-t border-rule px-4 py-10 text-[15px] leading-6">
      <h2 id="duvera-h" className="font-display text-2xl leading-8 font-semibold">
        Odkud data jsou a&nbsp;kdo za stránkou stojí
      </h2>

      <h3 className="mt-6 font-semibold">Data</h3>
      <p className="mt-1">
        Údaje o&nbsp;fondech pochází přímo od emitentů (Vanguard, iShares, State Street SPDR), z&nbsp;prospektů na SEC
        EDGAR, z&nbsp;KID a&nbsp;z&nbsp;adresáře NYSE, staženo {formatDate(DATA_RETRIEVED_AT)}. Průměrné náklady fondů
        v&nbsp;EU z&nbsp;
        <a href={ESMA.sourceUrl} className="underline">
          tržní zprávy ESMA
        </a>{" "}
        (data za rok 2024). U&nbsp;každé hodnoty ve srovnání je odkaz na zdroj.
      </p>

      <h3 className="mt-6 font-semibold">Provozovatel</h3>
      <p className="mt-1">
        {OPERATOR.about} Autor: {OPERATOR.name},{" "}
        <a href={`mailto:${OPERATOR.email}`} className="underline">
          {OPERATOR.email}
        </a>
        .
      </p>

      <div role="note" aria-labelledby="riziko-h" className="mt-8 border-2 border-ink p-4">
        <h3 id="riziko-h" className="font-semibold">
          Upozornění na rizika
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {RISK_WARNINGS.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
