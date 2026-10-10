// Výška stránky a sekcí na 375 × 812 (README, Výška stránky). Měří běžící server, cookie lištu odmítne.
// Spuštění: npm run build && npx next start -p 3100, pak node scripts/page-height.mjs [base_url]
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3100";
const SECTIONS = ["kalkulacka", "srovnani", "formular"];

async function measure(page) {
  return page.evaluate((ids) => {
    const out = { stranka: document.documentElement.scrollHeight };
    for (const id of ids) out[id] = Math.round(document.getElementById(id)?.getBoundingClientRect().height ?? 0);
    return out;
  }, SECTIONS);
}

async function open(browser, url) {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await page.goto(BASE + url);
  await page.getByTestId("cookie-banner").getByRole("button", { name: "Odmítnout" }).click();
  return page;
}

const browser = await chromium.launch();
const rows = [];

let page = await open(browser, "/");
rows.push(["hero A po načtení", await measure(page)]);
await page.getByLabel("Měsíčně investuji").fill("3000");
await page.waitForFunction(() => window.dataLayer?.some((e) => e.event === "calc_result"));
await page.waitForTimeout(300);
rows.push(["hero A po výsledku kalkulačky", await measure(page)]);

page = await open(browser, "/?utm_content=b-zvedavost");
rows.push(["hero B po načtení", await measure(page)]);

await browser.close();

console.log(`| Stav | Stránka | ${SECTIONS.map((s) => `#${s}`).join(" | ")} |`);
console.log(`| --- | --- | ${SECTIONS.map(() => "---").join(" | ")} |`);
for (const [name, m] of rows) {
  console.log(`| ${name} | ${m.stranka} px | ${SECTIONS.map((s) => `${m[s]} px`).join(" | ")} |`);
}
