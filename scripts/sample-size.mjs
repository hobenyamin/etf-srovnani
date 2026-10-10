// Minimální vzorek na variantu pro A/B test dvou podílů (README, Hypotézy pro A/B test).
// Oboustranný test, alfa 0,05, síla 80 %. Spuštění: node scripts/sample-size.mjs [p1 p2]
// n = (z_{α/2}·√(2·p̄·(1−p̄)) + z_β·√(p1·(1−p1) + p2·(1−p2)))² / (p1 − p2)²,  p̄ = (p1 + p2) / 2
const Z_ALPHA = 1.959964; // α = 0,05 oboustranně
const Z_BETA = 0.841621; // síla 80 %

export function sampleSize(p1, p2) {
  const pBar = (p1 + p2) / 2;
  const top = Z_ALPHA * Math.sqrt(2 * pBar * (1 - pBar)) + Z_BETA * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  return Math.ceil(top ** 2 / (p1 - p2) ** 2);
}

const [p1, p2] = process.argv.slice(2).map(Number);
if (p1 && p2) {
  console.log(sampleSize(p1, p2));
} else {
  const cases = [
    ["H1 lead / zobrazení stránky 4 % → 6 % (+50 %)", 0.04, 0.06],
    ["H1 lead / zobrazení stránky 4 % → 5,2 % (+30 %)", 0.04, 0.052],
    ["H2 lead / zobrazení stránky 4 % → 5 % (+25 %)", 0.04, 0.05],
    ["H3 calc_start / page_view 35 % → 40,25 % (+15 %)", 0.35, 0.4025],
  ];
  for (const [name, a, b] of cases) console.log(`${name}: n = ${sampleSize(a, b)} na variantu`);
}
