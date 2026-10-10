import { gunzipSync } from "node:zlib";
import { expect, type Page, test } from "@playwright/test";

// PostHog zahazuje eventy z automatizovaných prohlížečů (navigator.webdriver, „HeadlessChrome“).
// Pro test měření se proto tváříme jako běžný mobilní Chrome. Skutečné návštěvníky se to netýká.
test.use({
  userAgent:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
});

type Captured = { event: string; properties: Record<string, unknown> };

/**
 * Zachytí požadavky na proxy /ingest (v prohlížeči, na server nedojdou) a rozbalí eventy.
 * `direct` = požadavky přímo na doménu PostHogu – s proxy nesmí být žádný.
 */
async function interceptPostHog(page: Page) {
  const requests: string[] = [];
  const direct: string[] = [];
  const events: Captured[] = [];
  page.on("request", (r) => {
    if (/posthog\.(com|e2e\.test)/.test(new URL(r.url()).hostname)) direct.push(r.url());
  });
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false });
    Object.defineProperty(Navigator.prototype, "userAgentData", { get: () => undefined });
  });
  await page.route("**/ingest/**", async (route) => {
    const request = route.request();
    requests.push(request.url());
    const body = request.postDataBuffer();
    if (body?.length) {
      let text: string;
      try {
        text = gunzipSync(body).toString("utf8");
      } catch {
        text = body.toString("utf8");
      }
      try {
        // PostHog posílá { api_key, batch: [...] }, případně jeden event nebo pole
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.batch) ? parsed.batch : [parsed];
        events.push(...list);
      } catch {
        // jiný formát (např. base64) – stačí počet požadavků
      }
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  return { requests, direct, events };
}

async function storageKeys(page: Page) {
  return page.evaluate(() => ({
    local: Object.keys(localStorage).sort(),
    session: Object.keys(sessionStorage).filter((k) => k.startsWith("ph_") || k.startsWith("__ph")),
  }));
}

test("bez volby a po odmítnutí: žádný požadavek na PostHog, žádná cookie, v úložišti jen volba", async ({ page }) => {
  const ph = await interceptPostHog(page);
  await page.goto("/?utm_source=meta&utm_content=a-uspora");
  const banner = page.getByTestId("cookie-banner");
  await expect(banner).toBeVisible();

  // návštěvník používá stránku bez volby
  await page.getByLabel("Měsíčně investuji").fill("3000");
  await expect(page.getByTestId("lead-inline")).toBeVisible();
  expect(ph.requests).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
  expect((await storageKeys(page)).local).toEqual([]);

  await banner.getByRole("button", { name: "Odmítnout" }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  await page.getByLabel("Měsíčně investuji").fill("5000");
  await page.waitForTimeout(1500);

  expect(ph.requests).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
  expect(await storageKeys(page)).toEqual({ local: ["consent.v1"], session: [] });
});

test("po povolení: page_view a další kroky s ad_variant a UTM, bez e-mailu", async ({ page }) => {
  const ph = await interceptPostHog(page);
  await page.goto("/?utm_source=meta&utm_campaign=etf&utm_content=b-zvedavost");
  await page.getByTestId("cookie-banner").getByRole("button", { name: "Povolit měření" }).click();

  await page.locator("#formular").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2100); // časová past formuláře
  await page.getByRole("textbox", { name: "E-mail" }).fill("tester@example.com");
  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  await expect(page.getByTestId("thank-you")).toBeVisible();

  await expect.poll(() => ph.events.map((e) => e.event), { timeout: 15_000 }).toEqual(
    expect.arrayContaining(["page_view", "form_view", "form_submit"]),
  );
  const pageView = ph.events.find((e) => e.event === "page_view")!;
  expect(pageView.properties).toMatchObject({ ad_variant: "b", utm_source: "meta", utm_campaign: "etf", utm_content: "b-zvedavost" });
  expect(ph.events.filter((e) => e.event === "page_view")).toHaveLength(1);
  expect(JSON.stringify(ph.events)).not.toContain("tester@example.com");
  // nic automatického (autocapture, pageview, pageleave)
  expect(ph.events.filter((e) => e.event.startsWith("$autocapture") || e.event === "$pageview")).toEqual([]);
  // jen přes vlastní doménu
  expect(ph.requests.every((url) => new URL(url).pathname.startsWith("/ingest/"))).toBe(true);
  expect(ph.direct).toEqual([]);
  expect((await page.context().cookies()).map((c) => c.name)).toEqual([expect.stringMatching(/^ph_/)]);
});

test("odvolání z patičky: lišta se otevře, po odmítnutí zmizí cookie i úložiště PostHogu", async ({ page }) => {
  const ph = await interceptPostHog(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Povolit měření" }).click();
  await expect.poll(async () => (await page.context().cookies()).length).toBe(1);

  await page.getByRole("contentinfo").getByRole("button", { name: "Nastavení cookies" }).click();
  const banner = page.getByTestId("cookie-banner");
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("Teď: měření povoleno");
  await expect(banner.getByRole("heading")).toBeFocused();
  await banner.getByRole("button", { name: "Odmítnout" }).click();

  expect(await page.context().cookies()).toEqual([]);
  expect(await storageKeys(page)).toEqual({ local: ["consent.v1"], session: [] });
  const before = ph.requests.length;
  await page.getByLabel("Měsíčně investuji").fill("4000");
  await page.waitForTimeout(4000);
  expect(ph.requests.length).toBe(before);
});

test("odmítnout je stejně snadné jako povolit: stejná velikost, vedle sebe, klávesnicí", async ({ page }) => {
  await page.goto("/");
  const banner = page.getByTestId("cookie-banner");
  const reject = await banner.getByRole("button", { name: "Odmítnout" }).boundingBox();
  const accept = await banner.getByRole("button", { name: "Povolit měření" }).boundingBox();
  expect(reject!.width).toBeCloseTo(accept!.width, 0);
  expect(reject!.height).toBeCloseTo(accept!.height, 0);
  expect(reject!.y).toBeCloseTo(accept!.y, 0);
  expect(await page.context().cookies()).toEqual([]);
  await expect(banner.getByRole("checkbox")).toHaveCount(0); // žádné předvyplněné volby

  await banner.getByRole("button", { name: "Odmítnout" }).focus();
  await page.keyboard.press("Tab");
  await expect(banner.getByRole("button", { name: "Povolit měření" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Enter");
  await expect(banner).toBeHidden();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("consent.v1")!).analytics)).toBe(false);
});

for (const height of [812, 667]) {
  test(`lišta nezakryje CTA v hero ani na displeji 375 × ${height}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height });
    for (const url of ["/", "/?utm_content=b"]) {
      await page.goto(url);
      const banner = await page.getByTestId("cookie-banner").boundingBox();
      const cta = await page.locator("#hero a").last().boundingBox();
      expect(cta!.y + cta!.height, url).toBeLessThanOrEqual(banner!.y);
    }
  });
}

test("dokud je vidět lišta, spodní CTA se neukazuje (dvě lišty přes sebe ne)", async ({ page }) => {
  await page.goto("/");
  await page.locator("#srovnani").scrollIntoViewIfNeeded();
  // stejná výzva je i v patičce (FooterCta), tady jde o spodní lištu
  await expect(page.getByTestId("sticky-cta")).toHaveCount(0);
});

test("knihovna PostHogu se stáhne až po souhlasu (produkční build)", async ({ page }) => {
  // Kód knihovny poznáme podle značky „PostHog.js“ (logovací prefix posthog-js). Náš kód ji nemá.
  const libraryChunks: string[] = [];
  page.on("response", async (response) => {
    if (!response.url().endsWith(".js")) return;
    const body = await response.text().catch(() => "");
    if (body.includes("PostHog.js")) libraryChunks.push(response.url());
  });
  await page.goto("/");
  await expect(page.getByTestId("cookie-banner")).toBeVisible();
  await page.getByLabel("Měsíčně investuji").fill("3000");
  await page.waitForTimeout(1500);
  expect(libraryChunks).toEqual([]);

  await page.getByRole("button", { name: "Povolit měření" }).click();
  await expect.poll(() => libraryChunks.length).toBe(1);
});

test("proxy /ingest existuje na serveru a lomítko na konci se nepřesměrovává", async ({ request }) => {
  // Cíl přesměrování je v testech falešný host, takže server odpoví chybou brány – ne však 404 ani 308.
  const response = await request.post("/ingest/e/", { data: "{}", maxRedirects: 0 });
  expect([404, 307, 308]).not.toContain(response.status());
});
