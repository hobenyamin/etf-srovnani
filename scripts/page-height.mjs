// Výška stránky a sekcí na 375 × 812 (README, Výška stránky). Cookie lištu odmítne.
// Spuštění: node scripts/page-height.mjs
// Server si sestaví a spustí sám se stejnými testovacími proměnnými jako E2E (e2e/test-env.mjs),
// nikdy s .env.local. Na cizí běžící server se nepřipojí.
import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { chromium } from "@playwright/test";
import { assertSafeTestEnv, TEST_ENV } from "../e2e/test-env.mjs";

const PORT = 3101;
const BASE = `http://localhost:${PORT}`;

const portBusy = () =>
  new Promise((resolve) => {
    const socket = createConnection(PORT, "127.0.0.1");
    socket.once("connect", () => resolve(socket.end() && true));
    socket.once("error", () => resolve(false));
  });

if (await portBusy()) throw new Error(`Port ${PORT} je obsazený, cizí server neměříme.`);
const env = { ...process.env, ...TEST_ENV };
assertSafeTestEnv(env);

const server = spawn("sh", ["-c", `npm run build && npx next start -p ${PORT}`], { env, detached: true, stdio: "ignore" });
const stopServer = () => {
  try {
    process.kill(-server.pid); // celá skupina procesů, i next-server
  } catch {
    // už neběží
  }
};
process.on("exit", stopServer);
for (let i = 0; ; i++) {
  if (i > 300) throw new Error("Server se nespustil do 5 minut.");
  if (await portBusy()) break;
  await new Promise((r) => setTimeout(r, 1000));
}

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
