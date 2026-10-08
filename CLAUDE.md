@AGENTS.md

# CLAUDE.md – Konverzní landing page: ETF z NYSE pro českého investora

Tento soubor je kontext projektu pro Claude Code. Čti ho před každým úkolem a drž se ho.
Jazyk projektu: **čeština** (texty stránky, README, commity). Kód a názvy proměnných anglicky.

## O projektu

Praktický úkol do výběrového řízení na pozici Junior AI Developer v Clientelo Czech s.r.o.
(performance marketing a lead generation pro investiční projekty).
Termín odevzdání: **16. 10. 2026**.

Hlavní hodnoticí otázka: **Mohli bychom na tuto stránku zítra spustit placenou reklamu?**
Každé rozhodnutí poměřuj tím – technicky, obsahově i právně.

## Zadání (shrnutí, nic nevynechávat)

- Landing page s porovnáním ETF obchodovaných na NYSE pro českého drobného investora.
- Návštěvník přichází z reklamy, **na mobilu**, stránce dává jen pár sekund.
- Stránka je **lead magnet**: nabídne hodnotu a výměnou získá kontakt. Optimalizace na počet kontaktů, ne jen na hezký vzhled.
- **Nesmí působit jako základní výstup od Claude.** Design i texty promyšlené pro cílovou skupinu.
- Hodnota musí být zřejmá **ještě před vyplněním formuláře**.
- První obrazovka navazuje na slib reklamy a okamžitě říká, co návštěvník získá.
- Každý interaktivní prvek (porovnání, kalkulačka poplatků, skládání portfolia…) vede ke kontaktu.
- Formulář s co nejmenším počtem polí.
- Promyšlené, co návštěvník dostane po odeslání formuláře.
- **Skutečná data s uvedením zdroje.**
- **Měřit celou cestu** od příchodu po odeslání formuláře.
- Dvě verze reklamy.
- Nasazení na bezplatný hosting (Vercel).

## Odevzdávané výstupy

- [ ] Veřejný GitHub repozitář
- [ ] URL nasazené stránky
- [ ] Obě verze reklamy v repu (`ads/`)
- [ ] Kód s **průběžnou historií commitů** (malé, popisné commity – žádný jeden velký commit)
- [ ] Složka `ai-log/` s exporty konverzací z Claude Code (`/export`) po každé větší session
- [ ] README obsahuje:
  - cílovou skupinu, co návštěvník dostane za kontakt a v kterém okamžiku o něj žádáme
  - zdůvodnění pořadí sekcí
  - očekávanou konverzi s odůvodněním a zdrojem benchmarku
  - tři hypotézy na A/B test seřazené podle očekávaného dopadu
  - jak se pracovalo s AI: pokyny agentům, kontrola výstupu, kde se AI spletla
  - rozhodnutí v nejasnostech a proč
  - co chybí a proč
  - zdroje všech dat s datem stažení

## Klíčová rozhodnutí (neměnit bez důvodu)

1. **NYSE ETF ↔ UCITS ekvivalent.** Drobný investor v EU si ETF domicilovaná v USA (VOO, SPY, VTI…) běžně nekoupí – chybí KID podle nařízení PRIIPs. Stránka proto porovnává fondy z NYSE s dostupnými evropskými UCITS alternativami (např. VOO ↔ VUAA/CSPX). Nikdy nepiš „kupte VOO“.
2. **Jen fondy skutečně kotované na NYSE** (SPY, VOO, VTI, IVV jsou na NYSE Arca). QQQ je na Nasdaqu – vynechat, nebo výjimku zdůvodnit. Kotaci ověřit u emitenta.
3. **Formulář = jen e-mail + souhlas.** Další kvalifikační otázky až po odeslání a nepovinně.
4. **Žádost o kontakt až po interakci** – když uživatel vidí svůj výsledek z kalkulačky. Ne v hero.
5. **Žádné personalizované doporučení fondu** (riziko investičního poradenství bez licence). Kalkulačka počítá poplatky, nedoporučuje.
6. **Kampaň cílí jen na ČR.**

## Cílová skupina

- Česko, 25–45 let, mobil, přichází z Meta/Google reklamy.
- Začínající nebo mírně pokročilý investor, slyšel o S&P 500 a VOO, nerozumí poplatkům, měně a dostupnosti v ČR.
- Bolest: „Chci investovat do amerického indexu, ale nevím, který fond a proč mi ho broker nenabízí.“

## Výměna hodnoty

- **Zdarma hned:** porovnání 3–5 fondů + kalkulačka dopadu poplatků za 10–30 let (výsledek v Kč).
- **Za e-mail:** kompletní srovnání NYSE ETF ↔ UCITS ekvivalent (TER, měna, akumulace/distribuce, dostupnost v ČR) + daňový tahák (W-8BEN, časový test – jen obecná informace).
- **Po odeslání:** děkovací obrazovka s okamžitým zobrazením/stažením slíbeného obsahu (ne „čekejte na e-mail“), potvrzovací e-mail s double opt-in, jedna nepovinná kvalifikační otázka.

## Struktura stránky

1. Hero navazující na reklamu: slib + jedno konkrétní číslo + CTA na kalkulačku
2. Kalkulačka poplatků (vklad, měsíční částka, horizont → rozdíl v Kč)
3. Ukázka porovnání 3 fondů se zdrojem a datem dat
4. Formulář (e-mail + souhlas) s nabídkou plné verze
5. Důvěra: kdo za stránkou stojí, odkud jsou data, rizikové upozornění
6. Patička: identifikace provozovatele, zásady ochrany údajů, nastavení cookies

## Dvě verze reklamy

- **A – úspora:** „Při 2 000 Kč měsíčně je rozdíl v poplatcích fondů za 20 let přes 40 000 Kč – i bez jakéhokoli výnosu. Spočítejte si to.“ (ověření a disclaimer v `ads/README.md`)
- **B – zvědavost:** „Proč si v Česku nekoupíte VOO? A jaké alternativy jsou v ČR dostupné.“
- Ke každé: vizuál 1:1 / 4:5 (feed) a 9:16 (stories), primární text, nadpis, CTA, návrh cílení. Hero stránky musí odpovídat slibu reklamy (případně varianta hero podle `utm_content`).

## Technologie

| Vrstva | Volba | Poznámka |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Podle inzerátu Clientela |
| Styl | Tailwind CSS + vlastní font, paleta, ilustrace | Žádný „default shadcn/Claude“ vzhled |
| Hosting | Vercel (Hobby) | Pro ostrý provoz počítat s Pro |
| Leady | Supabase Postgres, region EU (Frankfurt) | Tabulka `leads` |
| E-maily | Resend nebo Brevo | Double opt-in, doručení lead magnetu |
| Měření | PostHog Cloud EU | Funnel eventů, viz níže |
| Pixely | Meta Pixel + CAPI, Google Ads tag | Až po souhlasu, Consent Mode v2 |
| Cookies | vlastní lišta nebo vanilla-cookieconsent | Odmítnout stejně snadno jako přijmout |
| Testy | Playwright (mobilní viewport), Lighthouse | LCP < 2,5 s na 4G |

### Tabulka `leads`

`id, email, created_at, consent_text, consent_at, double_opt_in_at, utm_source, utm_medium, utm_campaign, utm_content, ad_variant, calc_input (jsonb), calc_result (jsonb), user_agent`

### Měřené eventy (pojmenování dodržet)

`page_view → hero_cta_click → calc_start → calc_result → compare_view → form_view → form_submit → lead_confirmed`

Ke každému eventu přidat `ad_variant` a UTM. Bez souhlasu s analytickými cookies provozovat měření v režimu bez cookies.

## Data o ETF

- Uložena staticky v `data/etfs.json`. **Každá hodnota má `source_url` a `retrieved_at`.**
- Pole: `ticker, name, issuer, isin, exchange, domicile, currency, ter, aum, distribution, ucits_equivalent`.
- Zdroje: weby emitentů (Vanguard, iShares, SPDR), SEC EDGAR, NYSE. Nescrapovat Yahoo Finance. Ceny v reálném čase nepotřebujeme.
- Každé číslo, které AI navrhne, **ručně ověřit proti zdroji** před commitem. Nikdy si čísla nevymýšlet – chybějící údaj = `null` + poznámka.

## Právní mantinely (povinné)

Stránka je **vzdělávací srovnání s daty, ne investiční doporučení ani nabídka produktu.**

- **PRIIPs:** nepropagovat nákup US ETF drobnými investory; uvádět, že nejsou běžně dostupná, a ukázat UCITS alternativy.
- **MAR / ZPKT:** žádné „nejlepší ETF pro vás“, žádné výzvy ke koupi konkrétního nástroje. Fakta oddělit od názoru, uvádět zdroje.
- **MiFID II:** kalkulačka nesmí vydávat personalizované doporučení.
- **Reklama a spotřebitel (40/1995, 634/1992):** žádné zaručené výnosy; minulé výnosy jen s upozorněním; předpoklady kalkulačky viditelně uvedené.
- **Rizikové upozornění** na stránce, v lead magnetu i v e-mailu: hodnota investice může klesat, měnové riziko USD/CZK, data k datu X, nejde o doporučení.
- **GDPR:** správce, účel a právní základ u formuláře; odkaz na zásady; ukládat čas a znění souhlasu; data v EU. Předávání leadů partnerům jen s pojmenovanými příjemci a výslovným souhlasem.
- **480/2004 (obchodní sdělení):** marketingové e-maily jen se souhlasem, nepředvyplněný checkbox, odhlášení v každém e-mailu. Doručení slíbeného PDF ≠ newsletter – v textu souhlasu rozlišit.
- **127/2005 § 89 (cookies):** analytika a pixely až po aktivním souhlasu.
- **Patička:** název provozovatele, IČO, sídlo, kontakt.
- **Přístupnost:** kontrast, popisky polí, ovládání klávesnicí.
- **Reklamní platformy:** Google Ads od 2026 vyžaduje ověření finančních inzerentů v EU/EHP (u nefinančního informačního webu formulář pro nefinanční inzerenty); Meta omezuje cílení u finančních reklam. Zmínit v README jako riziko pro „spuštění zítra“.

Toto není právní rada; v README uvést, že před ostrým spuštěním je potřeba právní kontrola.

## Pravidla práce pro agenta

- Postupuj po malých krocích: data → komponenty → formulář → měření → texty → nasazení.
- Po každém dokončeném kroku navrhni commit (česká, popisná zpráva) a připomeň `/export` do `ai-log/`.
- Mobile first: navrhuj a testuj nejdřív na šířce 375 px.
- Texty piš česky, krátce, konkrétně, s čísly; žádné generické marketingové fráze.
- Nevymýšlej data, zdroje ani benchmarky. Když něco nevíš, řekni to a navrhni, kde to ověřit.
- Když narazíš na nejasnost v zadání, navrhni rozhodnutí a zapiš ho do sekce „Rozhodnutí“ v README.
- Chyby, které uděláš a které jsou opraveny, zapisuj do `docs/ai-chyby.md` (podklad pro README).
- Před označením úkolu za hotový: build projde, Playwright test na mobilu projde, ruční kontrola v prohlížeči.

## Struktura repozitáře

```
/app            Next.js stránky
/components     UI komponenty
/data           etfs.json (se zdroji a daty)
/lib            analytika, supabase, výpočty kalkulačky
/ads            obě verze reklamy (texty + vizuály)
/ai-log         exporty konverzací z Claude Code
/docs           ai-chyby.md, poznámky, screenshot funnelu
README.md
CLAUDE.md
```

## Harmonogram

| Datum | Krok |
| --- | --- |
| 9. 10. | Repo, README kostra, ai-log, finální rozhodnutí o pozicování |
| 10. 10. | Data 5–8 ETF se zdroji, ruční kontrola |
| 11.–12. 10. | Hero, kalkulačka, porovnání, formulář |
| 13. 10. | Supabase, e-mail, cookies, PostHog funnel, UTM |
| 14. 10. | Texty, obě reklamy, právní texty, nasazení na Vercel |
| 15. 10. | Testy na telefonu, Lighthouse, README |
| 16. 10. | Odeslat e-mail s odkazem na repo a URL |
