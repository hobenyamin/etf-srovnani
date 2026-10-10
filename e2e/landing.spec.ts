import { expect, type Page, test } from "@playwright/test";

const events = (page: Page) =>
  page.evaluate(() => (window.dataLayer ?? []).map((e) => e.event as string));

const entry = (page: Page, event: string) =>
  page.evaluate((name) => window.dataLayer?.find((e) => e.event === name), event);

const declineCookies = (page: Page) =>
  page.getByTestId("cookie-banner").getByRole("button", { name: "Odmítnout" }).click();

/** Vyplní kalkulačku a počká na ustálený výsledek (calc_result). */
async function calcResult(page: Page, monthly = "3000") {
  await page.getByLabel("Měsíčně investuji").fill(monthly);
  await expect.poll(() => events(page)).toContain("calc_result");
}

test("hero A: slib, číslo a CTA nad ohybem, bez e-mailu", async ({ page }) => {
  await page.goto("/?utm_source=meta&utm_content=a-uspora");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveText(/Kolik dělá rozdíl v\s+poplatcích fondů za 20\s+let\?/);
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
  // Reklama B vysvětluje „proč“ – hero musí totéž říct hned, ne až ve srovnání
  await expect(page.locator("#hero")).toContainText(/chybí KID, který nařízení PRIIPs vyžaduje/);
  await expect(page.getByRole("link", { name: "Ukázat srovnání" })).toBeInViewport();
  expect(new URL(page.url()).pathname).toBe("/");
  await expect.poll(() => page.evaluate(() => window.dataLayer?.[0]?.ad_variant)).toBe("b");
});

test("kalkulačka: CTA, změna vstupu, účtenka v Kč a formulář pod výsledkem", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Spočítat pro mě" }).click();
  await expect(page.locator("#kalkulacka")).toBeInViewport();
  await expect(page.getByTestId("lead-inline")).toHaveCount(0);

  await page.getByLabel("Měsíčně investuji").fill("3000");
  await expect(page.getByTestId("calc-gap")).toHaveText(/^\d[\d\s]*\sKč$/);
  const inline = page.getByTestId("lead-inline");
  await expect(inline).toBeVisible();
  await expect(inline.getByRole("textbox", { name: "E-mail" })).toBeVisible();
  await expect(inline.getByRole("button", { name: "Poslat mi srovnání" })).toBeVisible();
  // jen jeden aktivní formulář: dole zůstane tlačítko, které vede sem
  await expect(page.getByRole("textbox", { name: "E-mail" })).toHaveCount(1);
  await expect(page.locator("#formular").getByTestId("lead-pointer")).toHaveText("Poslat mi srovnání");
});

test("rozpis účtenky je na mobilu sbalený a jde rozbalit", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Měsíčně investuji").fill("3000");
  const toggle = page.getByRole("button", { name: "Zobrazit rozpis" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByTestId("receipt-breakdown")).toBeHidden();
  await toggle.click();
  await expect(page.getByRole("button", { name: "Skrýt rozpis" })).toHaveAttribute("aria-expanded", "true");
  const breakdown = page.getByTestId("receipt-breakdown");
  await expect(breakdown).toBeVisible();
  await expect(breakdown).toContainText("Vklady celkem");
  await expect(breakdown).toContainText("720 000 Kč");
  // předpoklady výpočtu jsou vidět vždy, nejsou v rozpisu
  await expect(page.locator("#kalkulacka").getByText(/Nezahrnuje měnové riziko/)).toBeVisible();
});

for (const height of [812, 667]) {
  test(`po výsledku je rozdíl i pole pro e-mail na jedné obrazovce (375 × ${height})`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height });
    await page.goto("/");
    await declineCookies(page);
    await calcResult(page);
    const inline = page.getByTestId("lead-inline");
    await expect(inline).toBeVisible();
    await page.getByTestId("receipt").evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
    for (const el of [page.getByTestId("calc-gap"), inline.getByRole("textbox", { name: "E-mail" })]) {
      const box = (await el.boundingBox())!;
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(height);
    }
  });
}

test("formulář pod výsledkem: po odeslání jsou obě místa v děkovacím stavu", async ({ page }) => {
  await page.goto("/");
  await calcResult(page);
  const inline = page.getByTestId("lead-inline");
  await inline.scrollIntoViewIfNeeded();
  await inline.getByRole("textbox", { name: "E-mail" }).fill("ivana@example.com");
  await inline.getByRole("button", { name: "Poslat mi srovnání" }).click();

  const thanks = page.locator("#kalkulacka").getByTestId("thank-you");
  await expect(thanks).toBeVisible();
  await expect(thanks.getByTestId("pair")).toHaveCount(5);
  await expect(page.locator("#formular").getByTestId("lead-done")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "E-mail" })).toHaveCount(0);
  await expect(page.getByTestId("thank-you")).toHaveCount(1);
  expect(await entry(page, "form_view")).toMatchObject({ form_location: "calc" });
  expect(await entry(page, "form_submit")).toMatchObject({ form_location: "calc" });
});

test("spodní formulář: form_location bottom, po odeslání se u kalkulačky formulář neukáže", async ({ page }) => {
  await page.goto("/#formular");
  await page.getByRole("textbox", { name: "E-mail" }).fill("ota@example.com");
  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  await expect(page.locator("#formular").getByTestId("thank-you")).toBeVisible();
  expect(await entry(page, "form_view")).toMatchObject({ form_location: "bottom" });
  expect(await entry(page, "form_submit")).toMatchObject({ form_location: "bottom" });

  await calcResult(page);
  await expect(page.getByTestId("lead-inline")).toHaveCount(0);
  await expect(page.locator("#kalkulacka").getByTestId("lead-done")).toBeVisible();
});

test("rozepsaný spodní formulář zůstane aktivní i po výsledku kalkulačky", async ({ page }) => {
  await page.goto("/#formular");
  await page.getByRole("textbox", { name: "E-mail" }).fill("rozepsano@example.com");
  await calcResult(page);
  await expect(page.getByTestId("lead-inline")).toHaveCount(0);
  await expect(page.locator("#formular").getByRole("textbox", { name: "E-mail" })).toHaveValue("rozepsano@example.com");
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

test("porovnání: přepínač 3 dvojic, vybraná VOO se zdroji, zamčené na jednom řádku", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#srovnani");
  const tabs = section.getByRole("tab");
  await expect(tabs).toHaveText(["SPY", "VOO", "IVV"]);
  await expect(section.getByRole("tab", { name: "VOO" })).toHaveAttribute("aria-selected", "true");
  // všechny tři karty jsou v HTML, vidět je jen vybraná
  await expect(section.getByTestId("pair")).toHaveCount(3);
  const visible = section.getByRole("tabpanel");
  await expect(visible).toHaveCount(1);
  await expect(visible.getByTestId("pair")).toContainText("VUAA");
  await expect(visible.locator('ol a[href^="https://"]').first()).toBeVisible();
  for (const tab of ["SPY", "IVV"]) {
    await section.getByRole("tab", { name: tab }).click();
    await expect(section.getByRole("tabpanel").locator('ol a[href^="https://"]').first()).toBeVisible();
  }

  const locked = page.getByTestId("locked");
  await expect(locked).toContainText("VTI");
  await expect(locked).toContainText("VT →");
  await expect(locked.getByRole("link")).toHaveAttribute("href", "#formular");
  // jeden řádek: text a odkaz vedle sebe, ne pod sebou
  const [text, link] = [await locked.locator("p").boundingBox(), await locked.getByRole("link").boundingBox()];
  expect(link!.x).toBeGreaterThan(text!.x + text!.width - 1);
});

test("přepínač srovnání jde ovládat klávesnicí", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#srovnani");
  const tab = (name: string) => section.getByRole("tab", { name });
  const panel = section.getByRole("tabpanel");

  await tab("VOO").focus();
  await page.keyboard.press("ArrowRight");
  await expect(tab("IVV")).toBeFocused();
  await expect(tab("IVV")).toHaveAttribute("aria-selected", "true");
  await expect(tab("VOO")).toHaveAttribute("aria-selected", "false");
  await expect(panel).toContainText("SXR8");
  await page.keyboard.press("ArrowRight");
  await expect(tab("SPY")).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(tab("IVV")).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tab("SPY")).toHaveAttribute("aria-selected", "true");
  await expect(panel).toContainText("SPYL");
  await page.keyboard.press("End");
  await expect(tab("IVV")).toHaveAttribute("aria-selected", "true");
  // jen vybraný tab je v pořadí Tab, další Tab vede do panelu
  await expect(tab("SPY")).toHaveAttribute("tabindex", "-1");
  await page.keyboard.press("Tab");
  await expect(panel).toBeFocused();
  await expect(panel).toHaveAttribute("aria-labelledby", (await tab("IVV").getAttribute("id"))!);
});

test("srovnání na 375 px je výrazně nižší než tři karty pod sebou", async ({ page }) => {
  await page.goto("/");
  // před přepínačem (tři karty) měřilo 1 755 px, scripts/page-height.mjs
  const box = await page.locator("#srovnani").boundingBox();
  expect(box!.height).toBeLessThan(1200);
});

test("formulář: validace, nepředvyplněný souhlas, děkovací stav s 5 dvojicemi", async ({ page }) => {
  await page.goto("/#formular");
  const consent = page.getByRole("checkbox");
  await expect(consent).not.toBeChecked();
  // neslibujeme, co zatím neexistuje
  await expect(page.locator("#formular")).not.toContainText(/tahák/i);

  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  await expect(page.locator("#formular").getByRole("alert")).toHaveText(/Vyplňte prosím e-mail/);
  await page.getByRole("textbox", { name: "E-mail" }).fill("jan@example");
  await page.getByRole("button", { name: "Zobrazit plné srovnání" }).click();
  await expect(page.locator("#formular").getByRole("alert")).toHaveText(/Zkontrolujte/);
  await expect(page.getByRole("textbox", { name: "E-mail" })).toHaveAttribute("aria-invalid", "true");

  await page.getByRole("textbox", { name: "E-mail" }).fill("jan@example.com");
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
  await page.keyboard.type("eva@example.com");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("checkbox")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("checkbox")).toBeChecked();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("thank-you")).toBeVisible();
});

test("375 px: žádný vodorovný scroll, pole mají popisky a písmo aspoň 16 px", async ({ page }) => {
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
  // menší písmo v poli = iOS při focusu přiblíží stránku
  await page.getByLabel("Měsíčně investuji").fill("3000");
  await expect(page.getByTestId("lead-inline")).toBeVisible();
  for (const input of await page.locator("main input[type=text], main input[type=email]").all()) {
    const size = await input.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size).toBeGreaterThanOrEqual(16);
  }
});

// Varianta A, přirozená cesta: hero → kalkulačka → formulář pod výsledkem. compare_view není povinný
// krok (formulář jde odeslat i bez srovnání), proto test hlídá jen pořadí povinných kroků.
test("měření: celá cesta v pořadí funnelu s ad_variant a UTM", async ({ page }) => {
  await page.goto("/?utm_source=meta&utm_campaign=etf&utm_content=a-uspora");
  await expect.poll(() => events(page)).toContain("page_view");
  await page.getByRole("link", { name: "Spočítat pro mě" }).click();
  await page.locator("#kalkulacka").scrollIntoViewIfNeeded();
  await calcResult(page, "5000");
  const inline = page.getByTestId("lead-inline");
  await inline.scrollIntoViewIfNeeded();
  await expect.poll(() => events(page)).toContain("form_view");
  await inline.getByRole("textbox", { name: "E-mail" }).fill("petr@example.com");
  await inline.getByRole("button", { name: "Poslat mi srovnání" }).click();
  await expect(page.getByTestId("thank-you")).toBeVisible();

  const funnel = ["page_view", "hero_cta_click", "calc_start", "calc_result", "form_view", "form_submit"];
  expect((await events(page)).filter((e) => funnel.includes(e))).toEqual(funnel);
  expect(await entry(page, "form_submit")).toMatchObject({ form_location: "calc" });
  const layer = await page.evaluate(() => window.dataLayer!);
  for (const e of layer) {
    expect(e).toMatchObject({ ad_variant: "a", utm_source: "meta", utm_content: "a-uspora" });
  }
});

test("nedostupná databáze: srovnání se zobrazí i tak a stránka to řekne", async ({ page }) => {
  await page.goto("/#formular");
  // déle než časová past proti robotům (MIN_FILL_MS), aby šel požadavek opravdu do databáze
  await page.waitForTimeout(2100);
  await page.getByRole("textbox", { name: "E-mail" }).fill("jana@example.com");
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
  await page.getByRole("textbox", { name: "E-mail" }).fill("bot@example.com");
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

test("kontextová lišta: před výpočtem kalkulačka, po výsledku formulář, schová se u formuláře a po odeslání", async ({ page }) => {
  const sticky = page.getByTestId("sticky-cta");
  // kus pod začátek sekce: kotva #srovnani (scroll-mt-4) nechá vidět posledních 16 px kalkulačky
  const jumpTo = (id: string) =>
    page.locator(`#${id}`).evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 200, behavior: "instant" }));

  // příchod rovnou na srovnání (kalkulačku přeskočil): lišta nabízí kalkulačku
  await page.goto("/");
  await declineCookies(page);
  await jumpTo("srovnani");
  await expect(sticky.getByRole("link", { name: "Spočítat své poplatky" })).toBeVisible();
  await sticky.getByRole("link").click();
  await expect(sticky).toHaveCount(0);

  await calcResult(page);
  // nahoře na stránce není vidět žádný formulář (srovnání je krátké, pod ním už je spodní sekce)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  const send = sticky.getByRole("button", { name: "Poslat mi srovnání" });
  await expect(send).toBeVisible();
  await send.click();
  const field = page.getByTestId("lead-inline").getByRole("textbox", { name: "E-mail" });
  await expect(field).toBeFocused();
  await expect(field).toBeInViewport();
  // formulář je vidět → lišta zmizí
  await expect(sticky).toHaveCount(0);
  expect(await entry(page, "form_cta_click")).toMatchObject({ cta: "sticky" });

  await field.fill("lenka@example.com");
  await page.getByTestId("lead-inline").getByRole("button", { name: "Poslat mi srovnání" }).click();
  await expect(page.getByTestId("thank-you")).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(sticky).toHaveCount(0);
});
