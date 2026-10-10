// Vyrenderuje vizuály reklam (ads/*/ad.html) do PNG pro Meta: feed 1:1 a 4:5, Stories 9:16.
// Fonty jdou z Google Fonts, takže render potřebuje síť. Spuštění: npm run render-ads
import { chromium } from "@playwright/test";
import { readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const FORMATS = [
  { f: "1x1", file: "feed-1x1.png", height: 1080 },
  { f: "4x5", file: "feed-4x5.png", height: 1350 },
  { f: "9x16", file: "stories-9x16.png", height: 1920 },
];

const adsDir = resolve("ads");
const variants = readdirSync(adsDir).filter((d) => existsSync(join(adsDir, d, "ad.html")));

const browser = await chromium.launch();
try {
  for (const variant of variants) {
    for (const { f, file, height } of FORMATS) {
      const page = await browser.newPage({ viewport: { width: 1080, height }, deviceScaleFactor: 1 });
      const url = `${pathToFileURL(join(adsDir, variant, "ad.html")).href}?f=${f}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      // Šablona nesmí přetéct plátno – jinak by se text v PNG oříznul
      const overflow = await page.evaluate(() => document.querySelector("main").scrollHeight > document.body.clientHeight);
      if (overflow) throw new Error(`${variant} ${f}: obsah přetéká plátno`);
      const out = join(adsDir, variant, file);
      await page.screenshot({ path: out });
      console.log(out);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
