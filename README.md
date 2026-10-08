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

TODO – pokyny agentům, kontrola výstupu, kde se AI spletla. Chyby: [`docs/ai-chyby.md`](docs/ai-chyby.md), exporty konverzací: [`ai-log/`](ai-log/).

## Rozhodnutí v nejasnostech

1. **Porovnáváme NYSE ETF s UCITS ekvivalentem.** Fondy domicilované v USA (VOO, SPY, VTI…) si drobný investor v EU běžně nekoupí, protože k nim chybí KID podle nařízení PRIIPs. Stránka proto vždy ukazuje dostupnou evropskou alternativu a nikdy nevyzývá ke koupi US fondu.
2. **Jen fondy skutečně kotované na NYSE.** Zadání mluví o NYSE; QQQ je na Nasdaqu, a proto ho vynecháváme nebo výjimku zdůvodníme. Kotaci ověřujeme u emitenta.
3. **Formulář = e-mail + souhlas.** Každé další pole snižuje konverzi; kvalifikační otázka přichází až po odeslání a je nepovinná.
4. **O kontakt žádáme až po interakci.** Ve chvíli, kdy návštěvník vidí svůj výsledek z kalkulačky, má hodnota konkrétní podobu – ne v hero.
5. **Žádné personalizované doporučení fondu.** Kalkulačka počítá poplatky, nedoporučuje; jinak by šlo o investiční poradenství bez licence (MiFID II).
6. **Kampaň cílí jen na ČR.** Texty, měna (Kč) i právní rámec jsou české.

## Co chybí a proč

TODO

## Zdroje dat

| Údaj | Zdroj | URL | Datum stažení |
| --- | --- | --- | --- |

## Právní upozornění

Stránka je vzdělávací srovnání s daty, ne investiční doporučení ani nabídka produktu. Tento projekt není právní rada; **před ostrým spuštěním je nutná právní kontrola** (PRIIPs, MAR/ZPKT, MiFID II, GDPR, zákony 40/1995, 634/1992, 480/2004 a 127/2005).

Rizika pro „spuštění zítra“ na straně reklamních platforem: Google Ads od roku 2026 vyžaduje v EU/EHP ověření finančních inzerentů (pro nefinanční informační web formulář pro nefinanční inzerenty) a Meta omezuje možnosti cílení u finančních reklam.

## Spuštění lokálně

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
