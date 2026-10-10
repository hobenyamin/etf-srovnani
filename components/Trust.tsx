import { More } from "@/components/More";
import { DATA_RETRIEVED_AT } from "@/lib/etfs";
import { ESMA } from "@/lib/fee-rows";
import { formatDate } from "@/lib/format";
import { OPERATOR, RISK_WARNINGS } from "@/lib/site";

export function Trust() {
  return (
    <section aria-labelledby="duvera-h" className="border-t border-rule px-4 py-12 text-[15px] leading-6">
      <h2 id="duvera-h" className="font-display text-[28px] leading-9 font-semibold">
        Odkud data jsou a&nbsp;kdo za stránkou stojí
      </h2>

      <More summary="Odkud jsou data" className="mt-4">
        <p>
          Údaje o&nbsp;fondech pochází přímo od emitentů (Vanguard, iShares, State Street SPDR), z&nbsp;prospektů na SEC
          EDGAR, z&nbsp;KID a&nbsp;z&nbsp;adresáře NYSE, staženo {formatDate(DATA_RETRIEVED_AT)}. Průměrné náklady fondů
          v&nbsp;EU z&nbsp;
          <a href={ESMA.sourceUrl} className="underline">
            tržní zprávy ESMA
          </a>{" "}
          (data za rok 2024). U&nbsp;každé hodnoty ve srovnání je odkaz na zdroj.
        </p>
      </More>

      <More summary="Kdo za stránkou stojí">
        <p>
          {OPERATOR.about} Autor: {OPERATOR.name},{" "}
          <a href={`mailto:${OPERATOR.email}`} className="underline">
            {OPERATOR.email}
          </a>
          .
        </p>
      </More>

      <div role="note" aria-labelledby="riziko-h" className="mt-6 border-2 border-ink p-4">
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
