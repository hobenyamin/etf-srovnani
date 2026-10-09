import { expect, type Page, test } from "@playwright/test";

const events = (page: Page) =>
  page.evaluate(() => (window.dataLayer ?? []).map((e) => e.event as string));

test("hero A: slib, číslo a CTA nad ohybem, bez e-mailu", async ({ page }) => {
  await page.goto("/?utm_source=meta&utm_content=a-uspora");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveText(/Kolik vás za 20\s+let stojí poplatky fondu\?/);
  await expect(h1).toBeInViewport();
  await expect(page.getByTestId("hero-gap")).toHaveText("44 200 Kč");
  await expect(page.getByRole("link", { name: "Spočítat pro mě" })).toBeInViewport();
  await expect(page.locator("#hero")).not.toContainText(/\baž\b/);
  await expect(page.locator("#hero input")).toHaveCount(0);
});

test("hero B podle utm_content", async ({ page }) => {
  await page.goto("/?utm_content=b-zvedavost");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Proč si v\s+Česku nekoupíte VOO\?/);
  await expect(page.getByText(/jaké alternativy jsou v\s+ČR dostupné/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Ukázat srovnání" })).toBeInViewport();
  expect(new URL(page.url()).pathname).toBe("/");
  await expect.poll(() => page.evaluate(() => window.dataLayer?.[0]?.ad_variant)).toBe("b");
});

test("kalkulačka: CTA, změna vstupu, účtenka v Kč a nabídka plné verze", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Spočítat pro mě" }).click();
  await expect(page.locator("#kalkulacka")).toBeInViewport();
  await expect(page.getByTestId("lead-offer")).toHaveCount(0);

  const monthly = page.getByLabel("Měsíčně investuji");
  await monthly.fill("3000");
  await expect(page.getByTestId("receipt")).toContainText("720 000 Kč");
  await expect(page.getByTestId("calc-gap")).toHaveText(/^\d[\d ]* Kč$/);
  await expect(page.getByTestId("lead-offer")).toBeVisible();
  await expect(page.getByTestId("lead-offer")).toHaveAttribute("href", "#formular");
});

test("kalkulačka při 2 000 Kč / 20 let / 0 % ukáže stejný rozdíl jako hero", async ({ page }) => {
  await page.goto("/");
  const hero = await page.getByTestId("hero-gap").textContent();
  await page.getByLabel("Měsíčně investuji").fill("2000");
  await page.getByLabel("Jednorázově na začátku").fill("0");
  await page.getByLabel("Doba investování").fill("20");
  await page.locator("label", { hasText: /^0\s%$/ }).click();
  await expect(page.getByTestId("calc-gap")).toHaveText(hero!);
});

test("porovnání: 3 dvojice se zdroji, zamčené vedou na formulář", async ({ page }) => {
  await page.goto("/");
  const pairs = page.locator("#srovnani").getByTestId("pair");
  await expect(pairs).toHaveCount(3);
  for (const pair of await pairs.all()) {
    await expect(pair.locator('ol a[href^="https://"]').first()).toBeVisible();
  }
  await expect(page.getByTestId("locked")).toContainText("VTI");
  await expect(page.getByTestId("locked").getByRole("link")).toHaveAttribute("href", "#formular");
});

test("formulář: validace, nepředvyplněný souhlas, děkovací stav s 5 dvojicemi", async ({ page }) => {
  await page.goto("/#formular");
  const consent = page.getByRole("checkbox");
  await expect(consent).not.toBeChecked();
  // neslibujeme, co zatím neexistuje
  await expect(page.locator("#formular")).not.toContainText(/tahák/i);

  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  await expect(page.locator("#formular").getByRole("alert")).toHaveText(/Vyplňte prosím e-mail/);
  await page.getByRole("textbox", { name: "E-mail" }).fill("jan@seznam");
  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  await expect(page.locator("#formular").getByRole("alert")).toHaveText(/Zkontrolujte/);
  await expect(page.getByRole("textbox", { name: "E-mail" })).toHaveAttribute("aria-invalid", "true");

  await page.getByRole("textbox", { name: "E-mail" }).fill("jan@seznam.cz");
  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  const thanks = page.getByTestId("thank-you");
  await expect(thanks).toBeVisible();
  await expect(thanks.getByTestId("pair")).toHaveCount(5);
  await expect(thanks).toContainText("ISIN");
  // jen public_note – žádné interní poznámky z dat
  await expect(thanks).not.toContainText(/tahák/i);
  await expect(thanks).not.toContainText("neověřováno");
  await expect(thanks).not.toContainText("Zamítnutý kandidát");
  const paragraphs = await thanks.locator("p").allTextContents();
  expect(paragraphs.join(" ")).not.toContain("https://");
});

test("formulář jde odeslat jen klávesnicí", async ({ page }) => {
  await page.goto("/#formular");
  await page.getByRole("textbox", { name: "E-mail" }).focus();
  await page.keyboard.type("eva@example.cz");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("checkbox")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("checkbox")).toBeChecked();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("thank-you")).toBeVisible();
});

test("375 px: žádný vodorovný scroll, pole mají popisky", async ({ page }) => {
  for (const url of ["/", "/?utm_content=b", "/zasady"]) {
    await page.goto(url);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width, url).toBeLessThanOrEqual(375);
  }
  await page.goto("/");
  // honeypot [name=website] je záměrně skrytý i před čtečkami (aria-hidden)
  for (const input of await page.locator("main input:not([type=radio]):not(.sr-only):not([name=website])").all()) {
    await expect(input).toHaveAccessibleName(/.+/);
  }
});

// Varianta A: CTA vede na kalkulačku, takže pořadí odpovídá funnelu z CLAUDE.md.
// (U varianty B vede CTA na srovnání a compare_view přijde před kalkulačkou – to je v pořádku.)
test("měření: celá cesta v pořadí funnelu s ad_variant a UTM", async ({ page }) => {
  await page.goto("/?utm_source=meta&utm_campaign=etf&utm_content=a-uspora");
  await expect.poll(() => events(page)).toContain("page_view");
  await page.getByRole("link", { name: "Spočítat pro mě" }).click();
  await page.locator("#kalkulacka").scrollIntoViewIfNeeded();
  await page.getByLabel("Měsíčně investuji").fill("5000");
  await expect(page.getByTestId("lead-offer")).toBeVisible();
  await page.locator("#srovnani").getByTestId("pair").first().scrollIntoViewIfNeeded();
  await expect.poll(() => events(page)).toContain("compare_view");
  await page.getByTestId("lead-offer").click();
  await expect.poll(() => events(page)).toContain("form_view");
  await page.getByRole("textbox", { name: "E-mail" }).fill("petr@example.cz");
  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  await expect(page.getByTestId("thank-you")).toBeVisible();

  const funnel = ["page_view", "hero_cta_click", "calc_start", "calc_result", "compare_view", "form_view", "form_submit"];
  expect((await events(page)).filter((e) => funnel.includes(e))).toEqual(funnel);
  const layer = await page.evaluate(() => window.dataLayer!);
  for (const entry of layer) {
    expect(entry).toMatchObject({ ad_variant: "a", utm_source: "meta", utm_content: "a-uspora" });
  }
});

test("nedostupná databáze: srovnání se zobrazí i tak a stránka to řekne", async ({ page }) => {
  await page.goto("/#formular");
  // déle než časová past proti robotům (MIN_FILL_MS), aby šel požadavek opravdu do databáze
  await page.waitForTimeout(2100);
  await page.getByRole("textbox", { name: "E-mail" }).fill("jana@example.cz");
  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  const thanks = page.getByTestId("thank-you");
  await expect(thanks.getByTestId("pair")).toHaveCount(5);
  await expect(page.getByTestId("delivery")).toContainText("nepodařilo", { timeout: 10_000 });
});

test("robot s vyplněným honeypotem dostane stejný děkovací stav", async ({ page }) => {
  await page.goto("/#formular");
  const honeypot = page.locator('input[name="website"]');
  await expect(honeypot).toHaveAttribute("tabindex", "-1");
  await honeypot.fill("https://spam.example", { force: true });
  await page.getByRole("textbox", { name: "E-mail" }).fill("bot@example.cz");
  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  await expect(page.getByTestId("thank-you").getByTestId("pair")).toHaveCount(5);
  await expect(page.getByTestId("delivery")).toContainText("Kopii vám pošleme");
});

test.describe("double opt-in a odhlášení", () => {
  test("potvrzení bez tokenu nebo s nesmyslným tokenem srovnání neukáže", async ({ page }) => {
    await page.goto("/potvrzeni");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tenhle odkaz nefunguje");
    await expect(page.getByTestId("pair")).toHaveCount(0);

    await page.goto("/potvrzeni?t=nesmysl");
    // samotné otevření odkazu nic nepotvrdí – až tlačítko
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Potvrďte svůj e-mail");
    await page.getByRole("button", { name: "Potvrdit e-mail" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tenhle odkaz nefunguje");
    await expect(page.getByTestId("pair")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Zadat e-mail znovu" })).toHaveAttribute("href", "/#formular");
  });

  test("výpadek databáze při potvrzení: chyba s možností zkusit znovu, žádný lead_confirmed", async ({ page }) => {
    await page.goto(`/potvrzeni?t=${"A".repeat(43)}`);
    await page.getByRole("button", { name: "Potvrdit e-mail" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Teď se to nepovedlo");
    await expect(page.getByRole("button", { name: "Zkusit znovu" })).toBeVisible();
    expect(await events(page)).not.toContain("lead_confirmed");
  });

  test("podvržený odkaz na odhlášení nikoho neodhlásí", async ({ page, request }) => {
    await page.goto("/odhlaseni?u=unsub:11111111-2222-3333-4444-555555555555.podvrh");
    await page.getByRole("button", { name: "Odhlásit se" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Odhlášení se nepovedlo");

    const oneClick = await request.post("/api/odhlaseni?u=podvrh", { form: { "List-Unsubscribe": "One-Click" } });
    expect(oneClick.status()).toBe(400);
  });

  test("375 px: stránky potvrzení a odhlášení bez vodorovného scrollu, noindex", async ({ page }) => {
    for (const url of ["/potvrzeni?t=x", "/odhlaseni?u=x"]) {
      await page.goto(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), url).toBeLessThanOrEqual(375);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
  });
});
