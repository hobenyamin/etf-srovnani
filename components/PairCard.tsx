import type { Fund, FundPair, Sourced } from "@/lib/etfs";
import { formatBillions, formatDate, formatPercent } from "@/lib/format";

const DISTRIBUTION = { accumulating: "akumulační", distributing: "distribuční" } as const;

type Cell = { text: string; field: Sourced<unknown> | null };
type Row = { label: string; us: Cell; ucits: Cell };

const cell = (field: Sourced<unknown>, text: string): Cell => ({ text, field });

function registration(fund: Fund): Cell {
  const v = fund.registered_in_cz.value;
  return cell(fund.registered_in_cz, v === true ? "ano (podle emitenta)" : "emitent neuvádí");
}

function rows(pair: FundPair, full: boolean): Row[] {
  const { us, ucits } = pair;
  const base: Row[] = [
    { label: "Burza", us: cell(us.exchange, us.exchange.value), ucits: cell(ucits.exchange, ucits.exchange.value) },
    { label: "Domicil", us: cell(us.domicile, us.domicile.value), ucits: cell(ucits.domicile, `${ucits.domicile.value} (UCITS)`) },
    { label: "TER ročně", us: cell(us.ter, formatPercent(us.ter.value)), ucits: cell(ucits.ter, formatPercent(ucits.ter.value)) },
    {
      label: "Dividendy",
      us: cell(us.distribution, DISTRIBUTION[us.distribution.value]),
      ucits: cell(ucits.distribution, DISTRIBUTION[ucits.distribution.value]),
    },
    {
      label: "Měna",
      us: cell(us.currency, us.currency.value),
      ucits: cell(ucits.currency, `${ucits.currency.value}, fond v ${ucits.base_currency.value}`),
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
    { label: "ISIN", us: cell(us.isin, us.isin.value), ucits: cell(ucits.isin, ucits.isin.value) },
  ];
}

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
                    {c.text}
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
      {(full || !same) && <p className="mt-2 text-[13px] leading-5 text-muted">{pair.us.ucits_equivalent!.note}</p>}
      <ol className="mt-2 space-y-0.5 text-[12px] leading-4 text-muted">
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
    </article>
  );
}
