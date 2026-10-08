// Kontrola data/etfs.json a data/benchmarks.json: zdroj a datum u každého pole, ISIN, vazby na UCITS ekvivalenty.
// Spuštění: node scripts/check-etfs.mjs
import { readFileSync } from 'node:fs';

const FIELDS = ['ticker', 'name', 'issuer', 'isin', 'exchange', 'domicile', 'currency', 'base_currency', 'ter', 'aum', 'distribution', 'index', 'registered_in_cz'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

// ISO 6166: písmena -> čísla (A=10), Luhn zprava
function isinValid(isin) {
  if (!/^[A-Z]{2}[A-Z0-9]{9}\d$/.test(isin)) return false;
  const digits = isin.slice(0, 11).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 0) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return (10 - (sum % 10)) % 10 === Number(isin[11]);
}

const data = JSON.parse(readFileSync(new URL('../data/etfs.json', import.meta.url), 'utf8'));
const errors = [];
const nulls = [];
const byIsin = new Map(data.funds.map((f) => [f.isin?.value, f]));

for (const fund of data.funds) {
  for (const key of FIELDS) {
    const field = fund[key];
    if (!field) { errors.push(`${fund.id}.${key}: chybí`); continue; }
    if (!field.source_url?.startsWith('https://')) errors.push(`${fund.id}.${key}: chybí source_url`);
    if (!DATE.test(field.retrieved_at ?? '')) errors.push(`${fund.id}.${key}: chybí retrieved_at`);
    if (field.value === null) {
      if (!field.note) errors.push(`${fund.id}.${key}: null bez poznámky`);
      nulls.push(`${fund.id}.${key}`);
    }
    for (const c of field.cross_check ?? []) {
      if (!c.source_url?.startsWith('https://') || !DATE.test(c.retrieved_at ?? '')) errors.push(`${fund.id}.${key}: neúplný cross_check`);
    }
  }
  if (fund.isin?.value && !isinValid(fund.isin.value)) errors.push(`${fund.id}: neplatný ISIN ${fund.isin.value}`);
  if (fund.aum?.value && !DATE.test(fund.aum.value.as_of ?? '')) errors.push(`${fund.id}.aum: chybí as_of`);

  const eq = fund.ucits_equivalent;
  if (fund.kind === 'us') {
    const target = byIsin.get(eq?.isin);
    if (!target || target.kind !== 'ucits') errors.push(`${fund.id}: ucits_equivalent ${eq?.isin} není UCITS fond v datech`);
    else if (eq.match === 'same_index' && target.index.value !== fund.index.value) errors.push(`${fund.id}: same_index, ale ${fund.index.value} ≠ ${target.index.value}`);
    else if (!['same_index', 'closest'].includes(eq.match)) errors.push(`${fund.id}: neznámý match ${eq.match}`);
  }
}

// Referenční náklady (ESMA) pro kalkulačku: stejné pravidlo – zdroj a datum u každé hodnoty
const bench = JSON.parse(readFileSync(new URL('../data/benchmarks.json', import.meta.url), 'utf8'));
for (const b of bench.benchmarks) {
  if (!b.ter?.source_url?.startsWith('https://')) errors.push(`${b.id}.ter: chybí source_url`);
  if (!DATE.test(b.ter?.retrieved_at ?? '')) errors.push(`${b.id}.ter: chybí retrieved_at`);
  if (typeof b.ter?.value !== 'number') errors.push(`${b.id}.ter: chybí hodnota`);
}

console.log(`Fondů: ${data.funds.length}, benchmarků: ${bench.benchmarks.length}, null hodnot: ${nulls.length}${nulls.length ? ` (${nulls.join(', ')})` : ''}`);
if (errors.length) {
  console.error(errors.map((e) => `CHYBA ${e}`).join('\n'));
  process.exit(1);
}
console.log('OK');
