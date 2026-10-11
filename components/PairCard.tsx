import { More } from "@/components/More";
import type { Fund, FundPair, Sourced } from "@/lib/etfs";
import { formatBillions, formatDate, formatPercent } from "@/lib/format";

const DISTRIBUTION = { accumulating: "reinvestuje (akumulační)", distributing: "vyplácí (distribuční)" } as const;

type Cell = { text: string; field: Sourced<unknown> | null };
/** code: kód (ISIN), který se nesmí zalomit – menší písmo, celý na jednom řádku */
type Row = { label: string; us: Cell; ucits: Cell; code?: boolean };

const cell = (field: Sourced<unknown>, text: string): Cell => ({ text, field });

function registration(fund: Fund): Cell {
  const v = fund.registered_in_cz.value;
  return cell(fund.registered_in_cz, v === true ? "ano (podle emitenta)" : "emitent neuvádí");
}

function rows(pair: FundPair, full: boolean): Row[] {
  const { us, ucits } = pair;
  const base: Row[] = [
    { label: "Burza", us: cell(us.exchange, us.exchange.value), ucits: cell(ucits.exchange, ucits.exchange.value) },
    { label: "Sídlo fondu", us: cell(us.domicile, us.domicile.value), ucits: cell(ucits.domicile, `${ucits.domicile.value} (UCITS)`) },
    { label: "Poplatek ročně", us: cell(us.ter, formatPercent(us.ter.value)), ucits: cell(ucits.ter, formatPercent(ucits.ter.value)) },
    {
      label: "Dividendy",
      us: cell(us.distribution, DISTRIBUTION[us.distribution.value]),
      ucits: cell(ucits.distribution, DISTRIBUTION[ucits.distribution.value]),
    },
    {
      label: "Měna nákupu",
      us: cell(us.currency, us.currency.value),
      ucits: cell(ucits.currency, `${ucits.currency.value} (fond vede hodnotu v ${ucits.base_currency.value})`),
    },
  ];
  if (!full) return base;
  return [
    ...base,
    {
      label: "Velikost fondu",
      us: cell(us.aum, `${formatBillions(us.aum.value.amount, us.aum.value.currency)} k ${formatDate(us.aum.value.as_of)}`),
      ucits: cell(
        ucits.aum,
        `${formatBillions(ucits.aum.value.amount, ucits.aum.value.currency)} k ${formatDate(ucits.aum.value.as_of)}`,
      ),
    },
    { label: "Registrace v ČR", us: { text: "–", field: null }, ucits: registration(ucits) },
    { label: "ISIN", us: cell(us.isin, us.isin.value), ucits: cell(ucits.isin, ucits.isin.value), code: true },
  ];
}

/** Vysvětlivky řádků pro laika, každá jedna věta. `full`: řádky jen v plném srovnání. */
const GLOSSARY: { term: string; text: string; full?: boolean }[] = [
  { term: "Burza", text: "kde se fond obchoduje; NYSE Arca patří skupině NYSE, Xetra je německá burza." },
  { term: "Sídlo fondu", text: "země, podle jejíchž pravidel fond vznikl." },
  { term: "Poplatek ročně (TER)", text: "kolik fond ročně strhne z vaší investice, platíte ho průběžně v ceně fondu." },
  {
    term: "Dividendy",
    text: "zda fond výplatu firem znovu investuje (akumulační), nebo vám ji posílá (distribuční).",
  },
  {
    term: "Měna nákupu",
    text: "v jaké měně fond na burze koupíte; měnové riziko to neodstraní, fond drží akcie v cizích měnách.",
  },
  { term: "Velikost fondu", text: "kolik peněz fond spravuje.", full: true },
  {
    term: "Registrace v ČR",
    text: "zda emitent uvádí Česko mezi zeměmi registrace; v registru ČNB jsme to neověřovali.",
    full: true,
  },
  { term: "ISIN", text: "mezinárodní kód fondu, podle kterého ho najdete u brokera.", full: true },
];

/** Dvojice NYSE ETF ↔ UCITS: hodnoty z dat, u každé číslo zdroje s odkazem a datem stažení. */
export function PairCard({ pair, full = false }: { pair: FundPair; full?: boolean }) {
  const table = rows(pair, full);
  const sources: { url: string; date: string }[] = [];
  const ref = (field: Sourced<unknown> | null) => {
    if (!field) return null;
    let i = sources.findIndex((s) => s.url === field.source_url);
    if (i < 0) i = sources.push({ url: field.source_url, date: field.retrieved_at }) - 1;
    return i + 1;
  };
  const id = `${pair.us.id}-${full ? "full" : "preview"}`;
  const same = pair.us.ucits_equivalent!.match === "same_index";

  return (
    <article className="border-t-2 border-ink pt-3" data-testid="pair">
      <p className="text-[13px] tracking-wide text-muted uppercase">
        {same ? `Stejný index: ${pair.us.index.value}` : "Nejbližší alternativa – jiný index"}
      </p>
      <table className="mt-2 w-full table-fixed text-[14px] leading-5">
        <colgroup>
          <col className="w-[30%]" />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr className="text-left align-bottom">
            <th scope="col" className="pb-2 font-normal text-muted">
              <span className="sr-only">Údaj</span>
            </th>
            <th scope="col" className="pb-2 pr-2">
              <span className="block text-[12px] font-normal text-muted">NYSE, USA</span>
              <span className="num text-lg">{pair.us.ticker.value}</span>
            </th>
            <th scope="col" className="pb-2">
              <span className="block text-[12px] font-normal text-muted">Dostupná v ČR</span>
              <span className="num text-lg">{pair.ucits.ticker.value}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr key={row.label} className="dotted align-top">
              <th scope="row" className="py-1.5 pr-2 text-left font-normal text-muted">
                {row.label}
              </th>
              {[row.us, row.ucits].map((c, i) => {
                const n = ref(c.field);
                return (
                  <td key={i} className="py-1.5 pr-2 break-words">
                    {row.code ? <span className="text-[13px] tracking-tight whitespace-nowrap">{c.text}</span> : c.text}
                    {n && (
                      <sup>
                        <a href={`#src-${id}-${n}`} className="ml-0.5 text-muted" aria-label={`zdroj ${n}`}>
                          {n}
                        </a>
                      </sup>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {(full || !same) && <p className="fine mt-2">{pair.us.ucits_equivalent!.public_note}</p>}
      <More summary="Co znamenají řádky" className="mt-1">
        <dl className="space-y-1">
          {GLOSSARY.filter((g) => full || !g.full).map((g) => (
            <div key={g.term}>
              <dt className="inline font-semibold text-ink">{g.term}:</dt> <dd className="inline">{g.text}</dd>
            </div>
          ))}
        </dl>
      </More>
      <More summary={`Zdroje a data (${sources.length})`}>
        <ol className="space-y-0.5">
          {sources.map((s, i) => (
            <li key={s.url} id={`src-${id}-${i + 1}`}>
              {i + 1}{" "}
              <a href={s.url} className="underline">
                {new URL(s.url).hostname}
              </a>
              , staženo {formatDate(s.date)}
            </li>
          ))}
        </ol>
      </More>
    </article>
  );
}
