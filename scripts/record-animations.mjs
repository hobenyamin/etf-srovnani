// Záznam animací kroku 8c na 375 × 812 → docs/screens/animace.webm (README, Vizuální systém).
// Spuštění: node scripts/record-animations.mjs
// Server si sestaví a spustí sám s testovacími proměnnými (scripts/test-server.mjs), nikdy s .env.local.
// Odeslání formuláře se zadrží v prohlížeči jako ve screens.mjs, takže se nic neuloží ani neodešle.
// Playwright nahrává jen webm (GIF by potřeboval ffmpeg).
import { copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { startTestServer } from "./test-server.mjs";

const OUT = join("docs", "screens", "animace.webm");
const VIEWPORT = { width: 375, height: 812 };
const videoDir = mkdtempSync(join(tmpdir(), "animace-"));

const { base: BASE, stop: stopServer } = await startTestServer(3104);
const browser = await chromium.launch();

/** Plynulý posun po krocích, aby bylo vidět objevování sekcí a spodní lištu. */
async function glide(page, to, step = 40) {
  const from = await page.evaluate(() => window.scrollY);
  const dir = Math.sign(to - from);
  for (let y = from; dir * (to - y) > 0; y += dir * step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(16);
  }
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), to);
}

const top = (page, selector) =>
  page.locator(selector).first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

let video;
try {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: videoDir, size: VIEWPORT },
  });
  const page = await context.newPage();
  video = page.video();
  const held = [];
  await page.route("**/*", (route) => {
    const req = route.request();
    if (req.method() === "POST" && req.headers()["next-action"]) held.push(route);
    else route.continue();
  });

  await page.goto(BASE + "/");
  await page.waitForTimeout(800);
  await page.getByTestId("cookie-banner").getByRole("button", { name: "Odmítnout" }).click();
  await page.waitForTimeout(600);

  // 1. Posun dolů: sekce se objevují, spodní lišta přijede (hero i kalkulačka mimo obrazovku)
  await glide(page, (await top(page, "#srovnani")) + 200);
  await page.waitForTimeout(1200);
  await glide(page, (await top(page, "footer")) - 200);
  await page.waitForTimeout(1000);

  // 2. Zpět ke kalkulačce: lišta odjede, číslo v účtence se plynule změní
  await glide(page, (await top(page, "#kalkulacka")) + 100, 120);
  await page.waitForTimeout(600);
  await page.getByLabel("Měsíčně investuji").fill("3000");
  await page.waitForFunction(() => window.dataLayer?.some((e) => e.event === "calc_result"));
  await page.getByTestId("receipt").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "5 000" }).click();
  await page.getByTestId("receipt").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  // 3. Rozbalení „Jak počítáme“
  const how = page.locator("summary", { hasText: "Jak počítáme" });
  await how.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await how.click();
  await page.waitForTimeout(1200);

  // 4. Nahoru: lišta s „Poslat mi srovnání“ přijede, klepnutí vede k poli a lišta odjede
  await glide(page, 0, 120);
  await page.waitForTimeout(1000);
  await page.getByTestId("sticky-cta").getByRole("button", { name: "Poslat mi srovnání" }).click();
  await page.waitForTimeout(1200);

  // 5. Odeslání: děkovací blok s razítkem
  const inline = page.getByTestId("lead-inline");
  await inline.getByRole("textbox", { name: "E-mail" }).fill("animace@example.com");
  await page.waitForTimeout(2100); // časová past formuláře (2 s)
  await inline.getByRole("button", { name: "Poslat mi srovnání" }).click();
  await page.getByTestId("thank-you").waitFor();
  await page.waitForTimeout(2000);

  for (const route of held) await route.abort();
  await context.close();
  copyFileSync(await video.path(), OUT);
} finally {
  await browser.close();
  stopServer();
  rmSync(videoDir, { recursive: true, force: true });
}

console.log(`Záznam: ${OUT}`);
