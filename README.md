# ETF z NYSE – srovnání pro českého investora

Konverzní landing page (lead magnet) pro českého drobného investora, který přichází z reklamy na mobilu. Porovnává ETF obchodovaná na NYSE s evropskými UCITS alternativami, které si v ČR skutečně koupí, a ukazuje dopad poplatků v Kč.

Praktický úkol do výběrového řízení Clientelo Czech s.r.o. Hodnoticí otázka: *Mohli bychom na tuto stránku zítra spustit placenou reklamu?*

- Nasazená stránka: TODO
- Reklamy: [`ads/`](ads/)

## Cílová skupina

TODO – kdo přichází, z jaké reklamy, s jakou bolestí.

## Výměna hodnoty

TODO – co návštěvník dostane zdarma, co za e-mail, co hned po odeslání a v kterém okamžiku o kontakt žádáme.

## Struktura stránky a pořadí sekcí

TODO – sekce v pořadí a proč právě toto pořadí.

## Očekávaná konverze

TODO – odhad konverze s odůvodněním a zdrojem benchmarku.

## Hypotézy pro A/B test

TODO – tři hypotézy seřazené podle očekávaného dopadu.

## Měření

Funnel: `page_view → hero_cta_click → calc_start → calc_result → compare_view → form_view → form_submit → lead_confirmed`. Každý event nese `ad_variant` (`a`/`b`) a UTM parametry z URL ([`lib/track.ts`](lib/track.ts)).

**Dva zdroje dat, každý na jinou otázku:**

| Otázka | Zdroj | Pokrytí |
| --- | --- | --- |
| Kolik leadů a potvrzení přinesla která reklama? | Supabase, tabulka `leads` (`ad_variant`, `utm_*`, `double_opt_in_at`) | **všichni** návštěvníci, kteří odeslali formulář, bez ohledu na cookies |
| Kde návštěvníci cestou odpadají? | PostHog Cloud EU, funnel 8 eventů | jen návštěvníci, kteří **povolili měření** |

Bez souhlasu se do PostHogu neposílá nic (rozhodnutí 33). Funnel v PostHogu je proto vzorek souhlasících a absolutní čísla v něm nesedí s návštěvností. Pro rozhodování o reklamě platí počty z databáze; PostHog ukazuje poměry mezi kroky.

Konverze podle reklamy (Supabase → SQL Editor):

```sql
select ad_variant, utm_source, utm_content,
       count(*)                                          as leady,
       count(double_opt_in_at)                           as potvrzene,
       round(100.0 * count(double_opt_in_at) / count(*), 1) as mira_potvrzeni_pct
from leads
group by 1, 2, 3
order by 1, 2, 3;
```

Pozor: nepotvrzené leady se po 30 dnech mažou, takže starší období zpětně ukáže míru potvrzení 100 %. Čísla za kampaň je potřeba exportovat do 30 dnů.

Funnel v PostHogu: Product analytics → New insight → Funnels, kroky v pořadí výše, breakdown podle `ad_variant`. Krok `lead_confirmed` přichází často z jiného zařízení (e-mail na mobilu) a v rámci jedné návštěvy se nepropojí. Míru potvrzení proto počítáme z databáze.

**Co PostHog dostane:** jen eventy funnelu s `ad_variant` a UTM, plus technické údaje, které přikládá sám (adresa stránky, prohlížeč, zařízení, obrazovka). Nedostane e-mail (žádné `identify`), autocapture, záznam obrazovky ani tokeny z odkazů v e-mailech (`stripSecrets` v [`lib/analytics.ts`](lib/analytics.ts)).

**Reklamní pixely (návrh, neimplementováno):** samostatná kategorie souhlasu `ads` (připravená v [`lib/consent.ts`](lib/consent.ts), v liště se zobrazí až s pixely).
- Google Ads: Consent Mode v2 s výchozím `denied` pro `ad_storage`, `ad_user_data`, `ad_personalization` a `analytics_storage`, po souhlasu `update` na `granted`.
- Meta Pixel: načte se až po souhlasu `ads`.
- Meta Conversions API ze `submitLead`: event `Lead` s `event_id` pro deduplikaci s pixelem, jen pokud návštěvník souhlasil s `ads`. Hashovaný e-mail jen s tímto souhlasem.
- Zásady i lišta se musí doplnit o pojmenované příjemce (Meta, Google).

## Reklamy

TODO – varianty A (úspora) a B (zvědavost), napojení hero na `utm_content`. Podklady v [`ads/`](ads/).

## Práce s AI

TODO – pokyny agentům. Chyby: [`docs/ai-chyby.md`](docs/ai-chyby.md), exporty konverzací: [`ai-log/`](ai-log/).

### Kontrola dat: tři vrstvy

1. **Claude Code, dva zdroje.** Každá kritická hodnota (burza, ISIN, TER) se stahuje přímo od emitenta a ověřuje proti druhému nezávislému zdroji (prospekt na SEC EDGAR, KID, factsheet, adresář NYSE, OpenFIGI). Do dat jde doslovný úryvek ze zdroje. Co nejde ověřit, je `null` s důvodem.
2. **Nezávislá křížová kontrola druhou AI.** Claude v chatu na claude.ai (mimo Claude Code) s webovým vyhledáváním. Přepočítal kontrolní číslice všech ISINů vlastním skriptem a dohledal TER VWCE a SXR4 u nezávislých zdrojů. Neměl přístup k této session, jen k výslednému `etfs.json`.
3. **Ruční ověření člověkem v prohlížeči.** Kritická pole SPY, VOO, VUAA a SXR8 (seznam v `meta.verified_by_human_scope` v [`data/etfs.json`](data/etfs.json), checklist [`docs/overeni-dat.md`](docs/overeni-dat.md)).

**Příklad, proč je zdrojem emitent, a ne AI ani agregátor:** revidující AI označila TER VWCE (0,14 %) a SXR4 (0,03 %) za chybu, protože vycházela ze zastaralých znalostí. Ověření u emitenta ukázalo, že hodnoty jsou správné: TER VWCE klesl z 0,19 % na 0,14 % s účinností od 28. 7. 2026 ([Vanguard, 2. 8. 2026](https://www.ch.vanguard/en/private-investor/insights/we-are-lowering-fees-on-one-of-our-most-popular-etfs); dohledala křížová kontrola, ověřeno i v Claude Code) a TER SXR4 uvádí iShares na stránce fondu i v KID. Znalosti jazykového modelu ani agregátory nemusí být aktuální, proto platí jen web a dokumenty emitenta.

### Ruční ověření: ukládání leadů (krok 4a, 2026-10-09)

Kód a SQL psala AI. Unit testy běží s mockovaným úložištěm a SQL bylo vyzkoušené v PGlite. Proti skutečnému Supabase (Frankfurt, free plán) to ověřil člověk:

| Kontrola | Výsledek |
| --- | --- |
| Migrace spuštěná celá v SQL Editoru | ✓ i `create extension pg_cron` na free plánu. Úloha `purge-unconfirmed-leads` je aktivní (`15 3 * * *`) |
| Uložení leadu z formuláře | ✓ UTM, `ad_variant`, `calc_input`, `calc_result`, `notice_text`. IP nikde |
| `calc_result` spočítaný serverem | ✓ nezávislý přepočet (2 700 Kč/měs., 12 let, 3 %) sedí ve všech 7 hodnotách |
| Druhé odeslání stejného e-mailu s jiným UTM a se souhlasem | ✓ jeden řádek, UTM původní, `marketing_consent`, `consent_text` a `consent_at` doplněné |
| Odpověď na kvalifikační otázku | ✓ `has_broker` uložené |
| Čtení veřejným (publishable) klíčem | ✓ odmítnuto: `42501 permission denied for table leads` |
| `purge_unconfirmed_leads()` | ✓ smazala nepotvrzený lead starší 30 dní; kontrolní `count` po smazání = 0 |

### Ruční ověření: double opt-in a e-mail (krok 4b, 2026-10-09)

Proti skutečnému Resend (doména `mail.hosek.cc`, region Ireland) a Supabase ověřil člověk:

| Kontrola | Výsledek |
| --- | --- |
| Doručení do Gmailu | ✓ doručená pošta (ne spam), odesílatel `srovnani@mail.hosek.cc`, obsah v pořádku |
| SPF / DKIM | ✓ PASS / PASS (doména `mail.hosek.cc`) |
| DMARC | ✗ FAIL: chyběl záznam. Přidán TXT `_dmarc.mail.hosek.cc` = `v=DMARC1; p=none;`, čeká se na propagaci DNS, **znovu neověřeno** |
| Potvrzení tlačítkem na `/potvrzeni` | ✓ vyplní `double_opt_in_at` |
| Cooldown 10 min | ✓ druhé odeslání na stejnou adresu e-mail neposlalo (jedno `confirm_sent_at`) |
| `marketing_audience` a odhlášení | **zatím neověřeno** ručně (jen v PGlite a unit testech) |

### Ruční ověření: cookie lišta a PostHog (krok 4c, 2026-10-09)

Proti skutečnému projektu PostHog Cloud EU ověřil člověk (`npm run dev`, prohlížeč):

| Kontrola | Výsledek |
| --- | --- |
| Před volbou a po „Odmítnout“ | ✓ 0 požadavků na `eu.i.posthog.com`, žádné cookies, v Local Storage jen `consent.v1` |
| Po „Povolit měření“ | ✓ `page_view`, `compare_view` a `form_view` v PostHogu (Activity) s `ad_variant` = `b` a `utm_source` = `test` |
| Eventy z doby před souhlasem | ✓ eventy kalkulačky se podle návrhu neodeslaly |
| Odvolání přes „Nastavení cookies“ | ✓ cookie `ph_…` zmizela, další požadavky neodcházejí |
| Stažení knihovny před volbou | ✗ v `npm run dev` se chunk `posthog-js` stáhl z localhostu už před volbou. Ověřeno v produkčním buildu: tam se knihovna stáhne až po souhlasu, jde jen o dev režim (rozhodnutí 36, E2E test) |
| Firefox s rozšířenou ochranou proti sledování (výchozí v anonymním okně) | ✗ blokuje `eu.i.posthog.com`, požadavky končí „CORS Failed“ a data **nedorazí, i když návštěvník souhlasil**. Po vypnutí ochrany stav 200. Řešení: reverse proxy `/ingest` (rozhodnutí 40), implementováno, **čeká na ruční ověření** |

## Rozhodnutí v nejasnostech

1. **Porovnáváme NYSE ETF s UCITS ekvivalentem.** Fondy domicilované v USA (VOO, SPY, VTI…) si drobný investor v EU běžně nekoupí, protože k nim chybí KID podle nařízení PRIIPs. Stránka proto vždy ukazuje dostupnou evropskou alternativu a nikdy nevyzývá ke koupi US fondu.
2. **Jen fondy skutečně kotované na NYSE.** Zadání mluví o NYSE; QQQ je na Nasdaqu, a proto ho vynecháváme nebo výjimku zdůvodníme. Kotaci ověřujeme u emitenta.
3. **Formulář = e-mail + souhlas.** Každé další pole snižuje konverzi; kvalifikační otázka přichází až po odeslání a je nepovinná.
4. **O kontakt žádáme až po interakci.** Ve chvíli, kdy návštěvník vidí svůj výsledek z kalkulačky, má hodnota konkrétní podobu – ne v hero.
5. **Žádné personalizované doporučení fondu.** Kalkulačka počítá poplatky, nedoporučuje; jinak by šlo o investiční poradenství bez licence (MiFID II).
6. **Kampaň cílí jen na ČR.** Texty, měna (Kč) i právní rámec jsou české.
7. **Párování fondů: stejný emitent a stejný index, kde to jde.** SPY↔SPYL, VOO↔VUAA, IVV↔SXR8 sledují S&P 500. VT↔VWCE a VTI↔SXR4 jsou jen „nejbližší alternativa“ (jiný index) a stránka to uvádí. U VTI↔SXR4: MSCI USA pokrývá jen velké a střední firmy, podle MSCI asi 85 % free-float kapitalizace trhu USA. Přesný UCITS ekvivalent celého trhu jsme nenašli.
8. **U UCITS ukazujeme akumulační třídu a kotaci na Xetře (EUR).** Xetru nabízí většina brokerů dostupných v ČR. Distribuční třídy jsou jen v poznámce.
9. **Dvě měny.** `currency` = měna obchodování na burze, `base_currency` = měna fondu. Pro měnové riziko USD/CZK je podstatná měna fondu – u všech 10 fondů USD.
10. **AUM = aktiva celého fondu s datem ze zdroje**, ne jen datum stažení. Velikost se mění denně; datum musí být vidět.
11. **ISIN US fondů dopočítán z CUSIP.** Weby emitentů v USA ISIN neuvádějí. Dopočet podle ISO 6166 ověřujeme proti OpenFIGI.
12. **Slib reklamy A stojí na průměrech ESMA, ne na našich ETF.** Mezi ETF v datech (TER 0,03–0,14 %) je rozdíl za 20 let jen v jednotkách tisíc Kč, „desítky tisíc Kč“ by byla nepravda. Platí až srovnání průměrného ETF (0,2 %) s průměrným aktivním akciovým fondem v EU (1,2 %) podle ESMA. Obě čísla jsou ze stejného zdroje a metodiky. Konkrétní fond české banky nepoužíváme: šlo by o porovnávací reklamu a jeden KID neukazuje průměr. Podrobně v [`ads/README.md`](ads/README.md).
13. **Hero A a reklama A počítají s výnosem 0 %.** Tvrzení tak nestojí na žádném předpokladu výnosu: 2 000 Kč měsíčně, 20 let → 44 200 Kč. Text reklamy proto uvádí podmínku: „Při 2 000 Kč měsíčně je rozdíl … přes 40 000 Kč“ – při 500 Kč měsíčně je to jen 11 061 Kč. Číslo v hero se počítá živě stejnou funkcí jako kalkulačka. Při 2 000 Kč / 20 let / 0 % ukáže kalkulačka v řádku „Rozdíl“ totéž číslo (hlídá unit i E2E test).
14. **Kalkulačka má výchozí modelový výnos 5 % – vědomá volba bez benchmarku.** Kulaté číslo pro ilustraci, ne odhad. Přepínač 0/3/5/7 % a text „zvolený příklad, ne odhad ani slib; výnos může být i záporný“ přímo u volby. Náklad = poplatky + výnos, o který kvůli nim investor přijde (měsíční model, TER strháván průběžně).
15. **V účtence jen UCITS fondy (dostupné v ČR) seskupené podle TER, plus dva průměry ESMA.** US fondy v kalkulačce nejsou – stránka je nenabízí. Žádný řádek není označen jako „nejlepší“.
16. **Varianta hero podle `utm_content`:** hodnota začínající `b` → hero B, jinak A. `proxy.ts` přepisuje na staticky předrenderovanou `/v/b` (noindex, canonical `/`), takže hero při načtení nebliká a URL s UTM zůstává.
17. **Formulář: e-mail + jeden nepovinný nepředvyplněný souhlas s novinkami.** Doručení srovnání je vyřízení žádosti (čl. 6 odst. 1 písm. b GDPR), novinky jen se souhlasem (480/2004) – oba texty jsou na stránce oddělené. Údaje provozovatele zatím viditelně „[doplnit]“ – nevymýšlíme je.
18. **Jeden řádek na e-mail, první atribuce zůstává.** Opakované odeslání nepřepíše UTM, variantu ani kalkulačku z prvního příchodu. Souhlas s novinkami se jen přidá (nové znění a čas). Odškrtnutý checkbox při dalším odeslání není odvolání souhlasu, to jde odkazem v e-mailu. Řeší to atomicky SQL funkce `upsert_lead` ([migrace](supabase/migrations/20261009_leads.sql)).
19. **Srovnání se zobrazí hned, lead se ukládá na pozadí.** Když databáze nebo limit selže, návštěvník srovnání stejně dostane a stránka mu řekne, že kopie e-mailem nepřijde. Slib „zobrazí se hned“ tak platí vždy.
20. **Ochrana proti spamu bez tření pro člověka:** skryté pole (honeypot), odeslání do 2 s od zobrazení a limit 20 odeslání za 10 minut na IP v paměti serveru. Limit je volnější, protože mobilní operátoři sdílejí IP mezi mnoha lidmi (CGNAT). Robot dostane stejnou odpověď jako člověk, ale nic se neuloží. CAPTCHA (Turnstile) zatím ne: snižuje konverzi a je to další třetí strana.
21. **IP adresu neukládáme.** Slouží jen jako klíč limitu v paměti. Do databáze ani do logů nejde, e-mail se nelogují ani při chybě.
22. **Výsledek kalkulačky k leadu přepočítává server** ze vstupů oříznutých na povolené rozsahy. Číslům z prohlížeče nevěříme.
23. **Nepotvrzené adresy mažeme po 30 dnech** (pg_cron, denně). Kdo nepotvrdil e-mail, nemá s námi vztah, který by delší uložení odůvodnil. Lhůtu pro potvrzené adresy určí provozovatel.
24. **Zápis do databáze jen ze serveru.** RLS je zapnuté bez jediné politiky, práva má jen role `service_role` (tajný klíč, jen na serveru, hlídá balíček `server-only`). Veřejný klíč nic nepřečte ani nezapíše.
25. **Double opt-in potvrzuje tlačítko, ne odkaz.** Bezpečnostní skenery odkazů (Outlook, firemní filtry) otevírají odkazy v e-mailech samy. Kdyby potvrzoval už samotný odkaz, `double_opt_in_at` by nic nedokazoval. Cena je jedno klepnutí navíc.
26. **Jeden e-mail: potvrzení a odkaz na srovnání dohromady.** Tlačítko „Potvrdit a otevřít srovnání“ vede na `/potvrzeni`, kde se po potvrzení zobrazí plné srovnání. Návštěvník ho už viděl na stránce, e-mail je kopie a důvod adresu potvrdit.
27. **Potvrzovací e-mail není obchodní sdělení** (480/2004). Vyřizuje žádost, takže v něm není žádná propagace, jen odkaz, identifikace odesílatele, rizikové upozornění a odhlášení. Novinky smí v budoucnu jít jen adresám ve view `marketing_audience`: se souhlasem, potvrzené a neodhlášené.
28. **Token v DB jen jako hash, platnost 14 dní.** Nový e-mail token nahradí, platí jen odkaz z posledního e-mailu. Po potvrzení hash zůstává, aby šel odkaz otevřít znovu („už potvrzeno“ + srovnání).
29. **Ochrana cizích schránek:** stejné adrese nejvýš jeden potvrzovací e-mail za 10 minut a celkem nejvýš 50 za hodinu (atomicky v DB funkci `claim_confirmation`). Už potvrzené adrese e-mail znovu nepošleme.
30. **E-mail odchází až po odpovědi** (`after()` v Next.js, na Vercelu `waitUntil`). Návštěvník na Resend nečeká. Když Resend selže, lead zůstává a chyba jde do logu bez e-mailové adresy.
31. **Odhlášení dvojím způsobem:** odkaz v patičce e-mailu (stránka s tlačítkem) a one-click podle RFC 8058 (`List-Unsubscribe-Post`), které nabízí Gmail i Apple Mail. Odkaz je podepsaný HMAC s vlastním účelem, takže ho nejde zaměnit ani podvrhnout. Původní znění a čas souhlasu po odhlášení zůstávají jako doklad.
32. **Rizikové upozornění má jedno znění** (`RISK_WARNINGS` v [`lib/site.ts`](lib/site.ts)) pro stránku i e-mail.
33. **Bez souhlasu neměříme vůbec nic** (rozhodl člověk). § 89 odst. 3 zákona 127/2005 přebírá čl. 5(3) směrnice ePrivacy. EDPB v Guidelines 2/2023 k jeho technickému rozsahu vykládá „přístup k zařízení“ široce, takže souhlas může potřebovat i měření bez cookies přes JavaScript. Francouzský CNIL má výjimku pro anonymní měření návštěvnosti, u českého ÚOOÚ obdobnou výjimku neznáme. Proto bez souhlasu nenačteme měřicí skript, nic neodešleme a uložíme jen volbu v liště. Cena: funnel v PostHogu vidí jen souhlasící, počty leadů jsou proto v Supabase.
34. **Vlastní lišta, odmítnout stejně snadné jako povolit:** dvě stejně velká tlačítka vedle sebe, stejný vzhled, žádné předvyplněné volby, bez „nastavení“ o úroveň níž. Lišta neblokuje obsah, nezakryje CTA v hero (testováno na 375 × 667 i 812) a dokud je vidět, spodní CTA se neukazuje. Odvolání přes „Nastavení cookies“ v patičce smaže cookie i úložiště PostHogu.
35. **Nabízíme jen kategorie, které existují.** Kategorie `ads` je v kódu připravená, ale v liště není: ptát se na souhlas s pixely, které na stránce nejsou, by bylo zavádějící.
36. **PostHog se stáhne až po souhlasu** (dynamický import). V produkčním buildu se knihovna (~310 kB) bez souhlasu nestáhne, takže neovlivní LCP. Před volbou se stáhne jen náš kód lišty a obálka s konfigurací (bez knihovny), hlídá to E2E test. V `npm run dev` Turbopack dynamické importy načítá dopředu, takže se tam knihovna stáhne z localhostu už před volbou. K PostHogu nic neodchází, jde jen o vývojový režim.
37. **Eventy z doby před souhlasem se neposílají dodatečně, kromě `page_view` aktuální stránky.** Ten jen říká, že návštěvník stránku právě vidí, a bez něj by funnel v PostHogu neměl první krok.
38. **Každý event hned, bez dávkování** (`request_batching: false`). Za návštěvu je jich nejvýš 8, takže po odvolání souhlasu nic nečeká ve frontě. Na mobilu se navíc eventy neztratí při zavření karty. Na chybu přišel E2E test: dávka nasbíraná se souhlasem odešla až po odvolání.
39. **Cookie PostHogu platí 180 dní** místo výchozích 365 a jen pro vlastní doménu. Na vyhodnocení kampaně to stačí.
40. **PostHog přes vlastní doménu (reverse proxy `/ingest`).** Prohlížeč posílá eventy na `/ingest/…` na naší doméně a Next.js je přepošle do PostHog EU (`rewrites` v [`next.config.ts`](next.config.ts), podle návodu PostHogu pro Next.js). Bez proxy by v datech chyběla část návštěvníků, kteří s měřením souhlasili. Firefox s rozšířenou ochranou proti sledování (výchozí v anonymním okně) blokuje `eu.i.posthog.com` a požadavky končí „CORS Failed“ (zjištěno ručním testem). Pravděpodobně totéž dělají blokátory reklam, to jsme neměřili. Funnel by tak byl zkreslený různě podle prohlížeče.
    - **Souhlas se neobchází:** knihovna se dál stáhne a spustí až po „Povolit měření“, mění se jen adresa, kam eventy odcházejí. Kdo si sám nainstaloval blokátor, může proxy vnímat jako obejití své volby; proti tomu stojí jeho výslovný souhlas v liště. Patří do právní kontroly.
    - **Cesta `/ingest` je zdokumentovaný standard PostHogu.** Zvolili jsme ji vědomě místo úmyslně skryté cesty: je lépe obhajitelná a transparentní (uvedená i v zásadách), i když se časem může dostat na seznamy blokátorů.
    - **IP adresy:** v projektu PostHog je zapnuté „Discard client IP data“ (ověřil člověk 2026-10-09), takže PostHog IP neukládá bez ohledu na proxy.
    - **Vedlejší efekt:** `skipTrailingSlashRedirect` (PostHog volá `/ingest/e/` s lomítkem na konci) vypíná přesměrování lomítka v celé aplikaci. `/zasady/` tak vrací stránku místo přesměrování na `/zasady`. Indexovat se dá jen `/`, ostatní stránky mají `noindex`, takže duplicitní URL nevadí.

## Co chybí a proč

- **Registr ČNB jsme nepoužili.** Seznam zahraničních investičních fondů (JERRS) má vyhledávání za CAPTCHA a webová služba WS JERRS vyžaduje certifikát a podle ISIN nehledá. Po 15 minutách pokusů jsme to vzdali. Místo toho pole `registered_in_cz` vychází ze seznamu zemí registrace na stránce emitenta: `true` u SPYL, SXR8 a SXR4. Vanguard (VUAA, VWCE) seznam zemí neuvádí, proto `null`. Toto pole zatím neprošlo ruční kontrolou.
- **Distribuční třídy UCITS fondů** (SPY5, VUSA, IUSA, VWRL) nejsou ověřené; v datech jsou jen jako poznámka.
- **Přesný UCITS ekvivalent VTI (celý US trh včetně malých firem)** jsme nenašli. SPDR Russell 3000 UCITS se podle OpenFIGI a SSGA zdá zrušený.
- **Průměrné náklady fondů přímo v ČR.** ESMA má přílohu po zemích (Annexes PDF); hodnotu za ČR jsme zatím nedohledali. Tisk uvádí průměr kolem 2 % (e15), ale jde o sekundární zdroj bez metodiky, proto ho nepoužíváme.
- **Údaje skutečného provozovatele.** Stránka je ukázkový projekt do výběrového řízení a jako autor je uveden Nikolas Hošek (hosek@weborio.cz). **Před ostrým spuštěním je nutné doplnit údaje skutečného provozovatele**: název, IČO, sídlo a kontakt v patičce i u formuláře (správce osobních údajů). Vyžaduje to zákon a reklamní platformy.
- **Plné znění zásad ochrany osobních údajů** (`/zasady` je kostra).
- **Limit odeslání je jen v paměti jedné instance.** Na Vercelu může běžet víc instancí, takže limit je orientační. Pro ostrý provoz: rate limiting ve Vercel Firewall nebo Upstash Redis. Turnstile až při skutečném spamu.
- **Free plán Supabase se po týdnu nečinnosti uspí** a mazání přes pg_cron pak neběží. Pro ostrý provoz Pro plán.
- **Poloha u eventů přes proxy:** po nasazení na Vercel ověřit, jestli PostHog vidí polohu návštěvníka, nebo serveru Vercelu. Pro kampaň jen v ČR ji nepotřebujeme.
- **Právní kontrola lišty a měření** (§ 89 zákona 127/2005, GDPR) před spuštěním. Naše řešení je konzervativní, ale není to právní rada.
- **Reklamní pixely a Conversions API** jsou jen navržené (sekce Měření) a čekají na schválení.
- **DMARC:** ověřit PASS po propagaci DNS. Před ostrým provozem zvážit přísnější politiku (`p=quarantine`, později `p=reject`) a reporty (`rua`). `p=none` jen sleduje, nic nechrání.
- **One-click odhlášení v Gmailu** (`List-Unsubscribe-Post`) otestovat až na Vercelu: Gmail volá `SITE_URL`, který lokálně není dostupný z internetu.
- **Ruční ověření `marketing_audience` a odhlášení** proti Supabase zatím chybí.
- **Bounce a stížnosti z Resend (webhooky)** zatím nezpracováváme. Nedoručitelné adresy zůstanou v DB jako nepotvrzené a po 30 dnech se smažou. Pro ostrý provoz napojit webhook a nedoručitelné adrese už nic neposílat.
- **Kvóta free plánu Resend.** Free plán má denní i měsíční limit e-mailů. Před spuštěním kampaně ověřit v ceníku Resend a podle očekávaného počtu leadů přejít na placený plán. Strop 50 e-mailů za hodinu je ochrana proti zneužití, ne náhrada.
- **Region funkcí na Vercelu.** Výchozí region serverových funkcí nemusí být v EU. Před nasazením nastavit region Frankfurt (`fra1`), kvůli rychlosti (Supabase je ve Frankfurtu) i kvůli tomu, aby osobní údaje zůstaly v EU. Ověřit v nastavení projektu.
- **Lhůta uložení potvrzených adres a příjemci údajů** v zásadách: musí doplnit provozovatel.
- **Migrace se spouští ručně** v SQL editoru Supabase (bez Supabase CLI). Logika SQL funkcí byla během vývoje ověřena v PGlite (Postgres ve WASM): upsert, práva rolí, mazání po 30 dnech, opakované spuštění.
- **Daňový tahák (W-8BEN, časový test).** Zatím neexistuje, proto ho stránka neslibuje – ani ve formuláři, ani na děkovací obrazovce. Vrátí se, až bude text se zdroji hotový a zkontrolovaný.

## Zdroje dat

Podrobně u každé hodnoty v [`data/etfs.json`](data/etfs.json) (`source_url`, `retrieved_at`) a v checklistu [`docs/overeni-dat.md`](docs/overeni-dat.md).

| Údaj | Zdroj | URL | Datum stažení |
| --- | --- | --- | --- |
| SPY, SPYL | State Street Global Advisors – stránky fondů, KID (EN, CZ) | [ssga.com](https://www.ssga.com) | 2026-10-08 |
| IVV, SXR8, SXR4 | iShares (BlackRock) – stránky fondů, EU PRIIPs KID | [ishares.com](https://www.ishares.com) | 2026-10-08 |
| VOO, VTI, VT | Vanguard – stránky pro poradce | [advisors.vanguard.com](https://advisors.vanguard.com) | 2026-10-08 |
| VUAA, VWCE | Vanguard Europe – stránky fondů, PRIIPs KID, factsheet | [vanguard.co.uk](https://www.vanguard.co.uk), [fund-docs.vanguard.com](https://fund-docs.vanguard.com) | 2026-10-08 |
| Burza a TER US fondů | SEC EDGAR – summary prospectus (497K) / prospectus (485BPOS) | [sec.gov](https://www.sec.gov/edgar/search/) | 2026-10-08 |
| Kotace na NYSE Arca | NYSE – adresář kotovaných fondů | [nyse.com](https://www.nyse.com/listings_directory/etf) | 2026-10-08 |
| Přejmenování indexu VTI | Vanguard – tisková zpráva 29. 4. 2026 | [corporate.vanguard.com](https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/pressroom/press-release-vanguard-to-update-names-of-us-equity-index-funds-tracking-morningstar-indexes-042926.html) | 2026-10-08 |
| Kontrola ISIN | OpenFIGI (Bloomberg) | [openfigi.com](https://www.openfigi.com) | 2026-10-08 |
| Kotace SXR4 na Xetře | Deutsche Börse | [live.deutsche-boerse.com](https://live.deutsche-boerse.com/etf/ishares-msci-usa-ucits-etf-usd-acc) | 2026-10-09 |
| Pokrytí indexu MSCI USA | MSCI – factsheet indexu | [msci.com](https://www.msci.com/documents/10199/255599/msci-usa-index-net.pdf) | 2026-10-09 |
| Průměrné náklady ETF a aktivních fondů v EU | ESMA – Costs and Performance of EU Retail Investment Products 2025 (data 2024) | [esma.europa.eu](https://www.esma.europa.eu/sites/default/files/2026-03/ESMA50-1949966494-4065_Market_Report_-_Costs_and_Performance_of_EU_Retail_Investment_Products.pdf) | 2026-10-09 |
| KID jako podmínka prodeje drobným investorům | Nařízení (EU) č. 1286/2014 (PRIIPs) | [eur-lex.europa.eu](https://eur-lex.europa.eu/eli/reg/2014/1286/oj) | – |

## Právní upozornění

Stránka je vzdělávací srovnání s daty, ne investiční doporučení ani nabídka produktu. Tento projekt není právní rada; **před ostrým spuštěním je nutná právní kontrola** (PRIIPs, MAR/ZPKT, MiFID II, GDPR, zákony 40/1995, 634/1992, 480/2004 a 127/2005).

Rizika pro „spuštění zítra“ na straně reklamních platforem: Google Ads od roku 2026 vyžaduje v EU/EHP ověření finančních inzerentů (pro nefinanční informační web formulář pro nefinanční inzerenty) a Meta omezuje možnosti cílení u finančních reklam.

## Spuštění lokálně

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm test             # unit testy výpočtu (Vitest)
npm run check-data   # kontrola zdrojů v data/
npx playwright install --with-deps chromium   # jednou
npm run e2e          # Playwright, mobil 375 px (ostré služby nevolá, viz playwright.config.ts)
```

### Nastavení služeb

1. `cp .env.example .env.local` a doplnit hodnoty podle komentářů v souboru. `.env.local` se necommituje.
2. Supabase: v SQL Editoru spustit postupně celé soubory z [`supabase/migrations/`](supabase/migrations/) podle názvu (`20261009_leads.sql`, pak `20261009_leads_double_opt_in.sql`). Když selže `create extension pg_cron`, zapnout Cron v Dashboardu (Integrations → Cron) a spustit zbytek souboru.
3. Resend: ověřená doména (zde `mail.hosek.cc`), API klíč s právem Sending access. `SITE_URL` je adresa, na kterou vedou odkazy v e-mailu.
4. Na Vercelu nastavit stejné proměnné (Settings → Environment Variables).

Variantu hero B zobrazíte přes `/?utm_content=b-zvedavost`.
