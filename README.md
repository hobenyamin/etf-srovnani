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

TODO – funnel `page_view → hero_cta_click → calc_start → calc_result → compare_view → form_view → form_submit → lead_confirmed`, UTM a `ad_variant`, režim bez cookies.

## Reklamy

TODO – varianty A (úspora) a B (zvědavost), napojení hero na `utm_content`. Podklady v [`ads/`](ads/).

## Práce s AI

TODO – pokyny agentům. Chyby: [`docs/ai-chyby.md`](docs/ai-chyby.md), exporty konverzací: [`ai-log/`](ai-log/).

### Kontrola dat: tři vrstvy

1. **Claude Code, dva zdroje.** Každá kritická hodnota (burza, ISIN, TER) se stahuje přímo od emitenta a ověřuje proti druhému nezávislému zdroji (prospekt na SEC EDGAR, KID, factsheet, adresář NYSE, OpenFIGI). Do dat jde doslovný úryvek ze zdroje. Co nejde ověřit, je `null` s důvodem.
2. **Nezávislá křížová kontrola druhou AI.** Claude v chatu na claude.ai (mimo Claude Code) s webovým vyhledáváním. Přepočítal kontrolní číslice všech ISINů vlastním skriptem a dohledal TER VWCE a SXR4 u nezávislých zdrojů. Neměl přístup k této session, jen k výslednému `etfs.json`.
3. **Ruční ověření člověkem v prohlížeči.** Kritická pole SPY, VOO, VUAA a SXR8 (seznam v `meta.verified_by_human_scope` v [`data/etfs.json`](data/etfs.json), checklist [`docs/overeni-dat.md`](docs/overeni-dat.md)).

**Příklad, proč je zdrojem emitent, a ne AI ani agregátor:** revidující AI označila TER VWCE (0,14 %) a SXR4 (0,03 %) za chybu, protože vycházela ze zastaralých znalostí. Ověření u emitenta ukázalo, že hodnoty jsou správné: TER VWCE klesl z 0,19 % na 0,14 % s účinností od 28. 7. 2026 ([Vanguard, 2. 8. 2026](https://www.ch.vanguard/en/private-investor/insights/we-are-lowering-fees-on-one-of-our-most-popular-etfs); dohledala křížová kontrola, ověřeno i v Claude Code) a TER SXR4 uvádí iShares na stránce fondu i v KID. Znalosti jazykového modelu ani agregátory nemusí být aktuální, proto platí jen web a dokumenty emitenta.

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

## Co chybí a proč

- **Registr ČNB jsme nepoužili.** Seznam zahraničních investičních fondů (JERRS) má vyhledávání za CAPTCHA a webová služba WS JERRS vyžaduje certifikát a podle ISIN nehledá. Po 15 minutách pokusů jsme to vzdali. Místo toho pole `registered_in_cz` vychází ze seznamu zemí registrace na stránce emitenta: `true` u SPYL, SXR8 a SXR4. Vanguard (VUAA, VWCE) seznam zemí neuvádí, proto `null`. Toto pole zatím neprošlo ruční kontrolou.
- **Distribuční třídy UCITS fondů** (SPY5, VUSA, IUSA, VWRL) nejsou ověřené; v datech jsou jen jako poznámka.
- **Přesný UCITS ekvivalent VTI (celý US trh včetně malých firem)** jsme nenašli. SPDR Russell 3000 UCITS se podle OpenFIGI a SSGA zdá zrušený.

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

## Právní upozornění

Stránka je vzdělávací srovnání s daty, ne investiční doporučení ani nabídka produktu. Tento projekt není právní rada; **před ostrým spuštěním je nutná právní kontrola** (PRIIPs, MAR/ZPKT, MiFID II, GDPR, zákony 40/1995, 634/1992, 480/2004 a 127/2005).

Rizika pro „spuštění zítra“ na straně reklamních platforem: Google Ads od roku 2026 vyžaduje v EU/EHP ověření finančních inzerentů (pro nefinanční informační web formulář pro nefinanční inzerenty) a Meta omezuje možnosti cílení u finančních reklam.

## Spuštění lokálně

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
