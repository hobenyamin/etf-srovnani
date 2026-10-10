// LCP a CLS na mobilu (README, Vizuální systém). Spuštění: node scripts/vitals.mjs [počet běhů, výchozí 5]
// Produkční build s testovacími proměnnými (scripts/test-server.mjs), nikdy s .env.local. 375 × 812,
// síť 150 ms / 1,6 Mb/s, CPU 4× zpomalené, studená cache v každém běhu, medián. Měří se v prohlížeči přes
// PerformanceObserver (ne Lighthouse).
// - načtení: cookie lišta zobrazená, LCP a CLS 3 s po načtení,
// - průchod: po odmítnutí cookies posun po 300 px až na konec stránky (objevení sekcí, spodní lišta), CLS celé návštěvy.
import { chromium } from "@playwright/test";
import { startTestServer } from "./test-server.mjs";

const RUNS = Number(process.argv[2] ?? 5);
const VARIANTS = [
  ["Hero A", "/"],
  ["Hero B", "/?utm_content=b-zvedavost"],
];

const { base: BASE, stop: stopServer } = await startTestServer(3103);
const browser = await chromium.launch();

function observe() {
  window.__vitals = { lcp: 0, cls: 0 };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__vitals.lcp = e.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
}

async function run(path) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1e6) / 8,
    uploadThroughput: (0.75 * 1e6) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(observe);
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const load = await page.evaluate(() => ({ ...window.__vitals }));

  await page.getByTestId("cookie-banner").getByRole("button", { name: "Odmítnout" }).click();
  await page.waitForTimeout(500);
  for (;;) {
    const done = await page.evaluate(() => {
      window.scrollBy({ top: 300, behavior: "instant" });
      return window.scrollY + innerHeight >= document.documentElement.scrollHeight - 1;
    });
    await page.waitForTimeout(250);
    if (done) break;
  }
  await page.waitForTimeout(1000);
  const scrolled = await page.evaluate(() => window.__vitals.cls);
  await context.close();
  return { lcp: load.lcp, cls: load.cls, clsScroll: scrolled };
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

const rows = [];
try {
  for (const [name, path] of VARIANTS) {
    const results = [];
    for (let i = 0; i < RUNS; i++) results.push(await run(path));
    rows.push([
      name,
      Math.round(median(results.map((r) => r.lcp))),
      median(results.map((r) => r.cls)).toFixed(3),
      Math.max(...results.map((r) => r.clsScroll)).toFixed(3),
      results.map((r) => Math.round(r.lcp)).join(", "),
    ]);
  }
} finally {
  await browser.close();
  stopServer();
}

console.log(`| Varianta | LCP (medián z ${RUNS}) | CLS načtení | CLS průchod (nejhorší běh) | LCP jednotlivě (ms) |`);
console.log("| --- | --- | --- | --- | --- |");
for (const r of rows) console.log(`| ${r.join(" | ")} |`);
