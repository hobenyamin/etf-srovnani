// Screenshoty klíčových stavů na 375 × 812 a počet slov na první obrazovce (README, Vizuální systém).
// Spuštění: node scripts/screens.mjs pred|po  → docs/screens/<pred|po>/*.png
// Server si sestaví a spustí sám s testovacími proměnnými (scripts/test-server.mjs), nikdy s .env.local.
// Odeslání formuláře se zadrží v prohlížeči, takže se nic neuloží ani neodešle.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { startTestServer } from "./test-server.mjs";

const phase = process.argv[2];
if (!["pred", "po"].includes(phase)) throw new Error("Použití: node scripts/screens.mjs pred|po");
const outDir = join("docs", "screens", phase);
mkdirSync(outDir, { recursive: true });

const { base: BASE, stop: stopServer } = await startTestServer(3102);
const VIEWPORT = { width: 375, height: 812 };

/** Slova, která jsou v obrazovce opravdu vidět: uvnitř viewportu a nezakrytá jiným prvkem (cookie lišta). */
function countVisibleWords() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let count = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || !parent.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue;
    if (parent.closest(".sr-only, script, style")) continue;
    const re = /[\p{L}\p{N}][\p{L}\p{N}.,%&:/\-]*/gu;
    for (let m = re.exec(node.data); m; m = re.exec(node.data)) {
      const range = document.createRange();
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const rect = range.getBoundingClientRect();
      if (!rect.width || rect.bottom <= 0 || rect.top >= innerHeight) continue;
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (hit && (hit === parent || parent.contains(hit) || hit.contains(parent))) count++;
    }
  }
  return count;
}

const browser = await chromium.launch();
const newPage = () =>
  browser.newPage({ viewport: VIEWPORT, isMobile: true, hasTouch: true, deviceScaleFactor: 2, reducedMotion: "reduce" });
const decline = (page) => page.getByTestId("cookie-banner").getByRole("button", { name: "Odmítnout" }).click();
const shot = (page, name) => page.screenshot({ path: join(outDir, `${name}.png`) });
const scrollTo = (page, selector) =>
  page.locator(selector).first().evaluate((el) => {
    el.scrollIntoView({ block: "start", behavior: "instant" });
    window.scrollBy({ top: -16, behavior: "instant" });
  });
const words = [];

try {
  for (const [name, url] of [
    ["hero A", "/?utm_content=a-uspora"],
    ["hero B", "/?utm_content=b-zvedavost"],
  ]) {
    const page = await newPage();
    await page.goto(BASE + url);
    await page.evaluate(() => document.fonts.ready);
    const withBanner = await page.evaluate(countVisibleWords);
    await decline(page);
    const withoutBanner = await page.evaluate(countVisibleWords);
    words.push([name, withBanner, withoutBanner]);
    await shot(page, name === "hero A" ? "1-hero-a" : "5-hero-b");
    await page.close();
  }

  const page = await newPage();
  // Server Action (POST s hlavičkou next-action) se zadrží: děkovací stav se ukáže, ale nic se neuloží
  const held = [];
  await page.route("**/*", (route) => {
    const req = route.request();
    if (req.method() === "POST" && req.headers()["next-action"]) held.push(route);
    else route.continue();
  });
  await page.goto(BASE + "/");
  await decline(page);
  await page.getByLabel("Měsíčně investuji").fill("3000");
  await page.waitForFunction(() => window.dataLayer?.some((e) => e.event === "calc_result"));
  await page.getByTestId("lead-inline").waitFor();
  await page.waitForTimeout(400);
  await scrollTo(page, '[data-testid="receipt"]');
  await shot(page, "2-vysledek-kalkulacky");

  await scrollTo(page, "#srovnani");
  await shot(page, "3-srovnani");

  const inline = page.getByTestId("lead-inline");
  await inline.getByRole("textbox", { name: "E-mail" }).fill("screens@example.com");
  await inline.getByRole("button", { name: "Poslat mi srovnání" }).click();
  await page.getByTestId("thank-you").waitFor();
  await page.waitForTimeout(400);
  await shot(page, "4-dekovaci-stav");
  for (const route of held) await route.abort();
  await page.close();
} finally {
  await browser.close();
  stopServer();
}

console.log(`Snímky: ${outDir}\n`);
console.log("| První obrazovka (375 × 812) | Slov s cookie lištou | Slov bez lišty |");
console.log("| --- | --- | --- |");
for (const [name, a, b] of words) console.log(`| ${name} | ${a} | ${b} |`);
