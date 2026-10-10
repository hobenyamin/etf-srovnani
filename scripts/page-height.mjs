// Výška stránky a sekcí na 375 × 812 (README, Výška stránky). Cookie lištu odmítne.
// Spuštění: node scripts/page-height.mjs
// Server si sestaví a spustí sám se stejnými testovacími proměnnými jako E2E (e2e/test-env.mjs),
// nikdy s .env.local. Na cizí běžící server se nepřipojí.
import { chromium } from "@playwright/test";
import { startTestServer } from "./test-server.mjs";

const { base: BASE, stop: stopServer } = await startTestServer(3101);

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
stopServer();

console.log(`| Stav | Stránka | ${SECTIONS.map((s) => `#${s}`).join(" | ")} |`);
console.log(`| --- | --- | ${SECTIONS.map(() => "---").join(" | ")} |`);
for (const [name, m] of rows) {
  console.log(`| ${name} | ${m.stranka} px | ${SECTIONS.map((s) => `${m[s]} px`).join(" | ")} |`);
}
