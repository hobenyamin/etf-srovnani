# ETF z NYSE – srovnání pro českého investora

Konverzní landing page (lead magnet) pro českého drobného investora, který přichází z reklamy na mobilu. Porovnává ETF obchodovaná na NYSE s evropskými UCITS alternativami, které si v ČR skutečně koupí, a ukazuje dopad poplatků v Kč.

Praktický úkol do výběrového řízení Clientelo Czech s.r.o. Hodnoticí otázka: *Mohli bychom na tuto stránku zítra spustit placenou reklamu?*

- Nasazená stránka: https://etf-srovnani.vercel.app (Vercel Hobby, funkce ve Frankfurtu)
- Reklamy: [`ads/`](ads/)

## Cílová skupina

- **Kdo:** Česko, 25–45 let, na mobilu, přichází z reklamy na Facebooku nebo Instagramu (reklama A nebo B). Persona je pracovní předpoklad ze zadání, ne změřená data.
- **Co ví:** začíná investovat, nebo je mírně pokročilý. Slyšel o S&P 500 a o VOO, nerozumí poplatkům (TER), měně a tomu, co si v ČR skutečně koupí.
- **Bolest:** „Chci investovat do amerického indexu, ale nevím, který fond a proč mi ho broker nenabízí.“
- **Čas:** stránce dává pár sekund. Proto první obrazovka nese jedno číslo nebo jednu otázku z reklamy a jedno tlačítko.
- **Pozor u cílení:** v reklamě na Meta nejde věk 25–45 nastavit (speciální kategorie, rozhodnutí 42). Personu zasáhnou zájmy a kreativa, reklamu uvidí i lidé 18–65+.

## Výměna hodnoty

| Kdy | Co návštěvník dostane | Za co |
| --- | --- | --- |
| Hned, bez e-mailu | Kalkulačka dopadu poplatků v Kč (vlastní částka, horizont, modelový výnos). Ukázka srovnání 3 dvojic NYSE ↔ UCITS se stejným indexem (přepínač), se zdrojem a datem | nic |
| Po zadání e-mailu, **hned na stránce** | Plné srovnání všech 5 dvojic: TER, měna, akumulace, burza, velikost fondu, registrace v ČR, ISIN | e-mail (+ nepovinný souhlas s novinkami) |
| Po odeslání | Děkovací obrazovka se srovnáním (nečeká se na e-mail), jedna nepovinná otázka „Máte už účet u brokera?“ | – |
| E-mailem | Potvrzovací e-mail (double opt-in), tlačítko „Potvrdit a otevřít srovnání“ | potvrzení adresy |

**Kdy žádáme o kontakt:** až když návštěvník vidí svůj výsledek z kalkulačky (rozhodnutí 4). Pole pro e-mail se objeví hned pod výsledkem, až po první změně vstupu (rozhodnutí 45). Kdo kalkulačku přeskočí (hero B), najde formulář za ukázkou srovnání. V hero žádné pole ani zmínka o e-mailu není (hlídá E2E test). Spodní lepicí lišta vede před výsledkem na kalkulačku a na formulář až po výsledku.

Daňový tahák (W-8BEN) stránka zatím neslibuje, protože neexistuje (Co chybí).

## Struktura stránky a pořadí sekcí

Pořadí v kódu: [`components/Landing.tsx`](components/Landing.tsx).

| # | Sekce | Úkol | Proč právě tady |
| --- | --- | --- | --- |
| 1 | **Hero** | Navázat na slib reklamy: A číslo 44 200 Kč, B otázka „Proč si v Česku nekoupíte VOO?“ a odpověď (chybí KID). Jedno tlačítko | Návštěvník z reklamy během pár sekund kontroluje, jestli je na správném místě. Hero opakuje slib reklamy doslova, jinak odchází. O kontakt v tuhle chvíli nežádáme, protože zatím nic nedostal |
| 2 | **Kalkulačka + formulář pod výsledkem** | Z obecného čísla udělat jeho číslo v Kč. Po výsledku hned pod ním pole pro e-mail („Poslat mi srovnání“) | Nejsilnější hodnota zdarma a jediná osobní. Kdo zadá vlastní částku, investoval čas a má konkrétní důvod pokračovat. Výsledek je okamžik největšího zájmu, proto žádost o kontakt přichází právě tady (rozhodnutí 4 a 45). Rozdíl v Kč i pole jsou vidět na jedné obrazovce. Tlačítko hero A sem vede přímo |
| 3 | **Ukázka srovnání** | Ukázat, že plná verze má skutečný obsah (přepínač SPY / VOO / IVV, jedna dvojice se zdrojem a datem) | Důkaz kvality před žádostí o e-mail. Vysvětluje i „proč ne VOO“ (PRIIPs/KID), takže sem vede tlačítko hero B. Přepínač místo tří karet zkrátil sekci na polovinu |
| 4 | **Formulář** | E-mail za plné srovnání (5 dvojic, víc parametrů) | Pro ty, kdo kalkulačku přeskočili (hero B): teprve teď vědí, co dostanou, a viděli kousek zdarma. Po výsledku kalkulačky tu zůstane jen tlačítko na formulář nahoře (rozhodnutí 46) |
| 5 | **Důvěra** | Kdo za stránkou stojí, odkud jsou data, rizikové upozornění | Pro ty, kdo váhají: hledají to až při rozhodování o e-mailu, ne před ním. Rizikové upozornění tu je celé, krátká upozornění jsou i u čísel výše |
| 6 | **Patička** | Provozovatel, zásady ochrany údajů, nastavení cookies | Povinné údaje. Nastavení cookies jde kdykoli změnit |

Hero B vede rovnou na srovnání (3), ne na kalkulačku. Kdo přišel s otázkou „proč ne VOO“, chce nejdřív odpověď. Kalkulačku přeskočí, ale formulář (4) má hned pod srovnáním.

Spodní lišta na mobilu se řídí tím, kde návštěvník je. Před výsledkem nabízí „Spočítat své poplatky“, když není vidět hero ani kalkulačka. Po výsledku nabízí „Poslat mi srovnání“ a dá focus do pole pro e-mail. Schová se, když je formulář vidět, po odeslání a dokud je vidět cookie lišta.

Stejnou výzvu má i patička (krok 8b): kdo dočte až dolů, nekončí ve slepé uličce. Lišta se schová, když je výzva v patičce vidět, aby nebyly dvě stejné pod sebou. Logiku sdílí [`components/NextStepCta.tsx`](components/NextStepCta.tsx), v eventu se liší jen `cta: "sticky"` a `cta: "footer"`.

### Výška stránky na 375 px

Změřeno 2026-10-10 skriptem [`scripts/page-height.mjs`](scripts/page-height.mjs) (375 × 812, produkční build, cookie lišta odmítnutá). Zopakovat: `node scripts/page-height.mjs`. Skript si sám sestaví a spustí server na portu 3101 se stejnými testovacími proměnnými jako E2E ([`e2e/test-env.mjs`](e2e/test-env.mjs)), nikdy s `.env.local`.

| Stav | Stránka před | Stránka po | `#srovnani` před | `#srovnani` po |
| --- | --- | --- | --- | --- |
| hero A po načtení | 5 609 px | 4 339 px (−23 %) | 1 755 px | 880 px (−50 %) |
| hero A po výsledku kalkulačky | 5 743 px | 4 588 px (−20 %) | 1 755 px | 880 px |
| hero B po načtení | 5 613 px | 4 343 px (−23 %) | 1 755 px | 880 px |

Kalkulačka je po načtení nižší (1 562 → 1 167 px), protože rozpis účtenky je na mobilu sbalený. Po výsledku je vyšší (1 696 → 1 712 px), protože obsahuje formulář. Spodní sekce formuláře se po výsledku zmenší na tlačítko (684 → 388 px). Před: commit `375dfdf`, po: krok 8a.

Po kroku 8b (vizuální systém, 2026-10-10): stránka 4 358 px (hero A), 4 634 px (po výsledku), 4 360 px (hero B). Větší nadpisy, čísla a mezery přidaly 20–46 px. Rozbalovací pole se zdroji zkrátila srovnání (880 → 853 px).

### Velikost HTML: plné srovnání je ve stránce dvakrát

Plné srovnání (5 dvojic, obsah za e-mail) dostávají jako hotový obsah ze serveru obě místa formuláře: pod kalkulačkou i dole (rozhodnutí 47). Vidět je nejvýš jednou, ale data pro React (RSC payload) jdou v HTML dvakrát.

Změřeno 2026-10-10 na produkčním buildu s testovacími proměnnými. Porovnání: stejný kód, jen kalkulačka dostala `fullComparison={null}`. gzip = stažené HTML zkomprimované lokálně (`gzip -c`).

| Stránka | Jedno vykreslení | Dvě vykreslení (dnes) | Rozdíl |
| --- | --- | --- | --- |
| `/` (hero A), nekomprimované | 110,3 kB | 156,2 kB | +45,9 kB (+42 %) |
| `/` (hero A), gzip | 13,2 kB | 14,6 kB | +1,4 kB (+11 %) |
| hero B, nekomprimované | 112,2 kB | 158,0 kB | +45,8 kB (+41 %) |
| hero B, gzip | 13,3 kB | 16,7 kB | +3,4 kB (+25 %) |

- **Přenos:** po síti jde HTML komprimované, takže navíc je 1,4–3,4 kB. Na 4G jsou to jednotky milisekund. Rozdíl mezi A a B je nejspíš v tom, jak daleko od sebe obě kopie v HTML leží a jestli je gzip najde v okně 32 kB. Neověřovali jsme to.
- **Vliv na LCP:** prohlížeč musí rozbalit a zpracovat o 46 kB víc dat pro React. Na LCP jsme to neměřili, Lighthouse je v plánu na 15. 10.
- **Jak to odstranit, pokud to vadí:** předat plné srovnání jen jednou, např. jeden serverový slot v `Landing`, který se po odeslání zobrazí v místě odeslání. Druhá možnost je načíst ho až po odeslání ze Server Action. Zatím ne: rozdíl po kompresi je malý a druhé řešení by porušilo slib „zobrazí se hned“ při výpadku sítě.

### Vizuální systém „Výpis z účtu 2.0“ (krok 8b)

Podle designové revize. Čísla, právní texty, eventy ani chování formulářů se nezměnily.

- **Barvy s jedním významem.** Kobaltová `#1D4ED8` jen pro primární tlačítka, aktivní stav přepínačů a odkazy-výzvy. Oranžovočervená jen pro ztrátu (náklady), zelená jen pro levnější variantu. Tokeny a kontrasty jsou v [`app/globals.css`](app/globals.css).
- **Písma.** Text i čísla v Atkinson Hyperlegible Next (latin-ext, tabulkové číslice). Nula je přeškrtnutá, takže „VOO“ se nesplete s „V00“. Nadpisy ve Fraunces s pevnou optickou velikostí `opsz 48`, takže nadpis A i B (stránka i reklamy) má stejný řez. Pole formulářů mají aspoň 16 px, menší písmo by iOS při focusu přiblížilo. Hlídá to E2E test.
- **Hierarchie.** Nadpis hero 36 px, číslo v hero 56 px, rozdíl v účtence 40 px. Vedlejší text (`.fine`, 13 px) je v užším sloupci (52 znaků). Zdroje, metodika a údaje o datech jsou ve sbalených `<details>`. Rizikové upozornění a podmínky u čísel jsou vidět vždy (rozhodnutí 49).
- **Děkovací stav vybočí:** tmavý blok s ikonou a nadpisem „Hotovo.“, plné srovnání pod ním.
- **Mikrointerakce:** stisk tlačítek, plynulá změna čísla v účtence (300 ms) a „Ukládáme adresu…“ po odeslání. Při `prefers-reduced-motion` se nic nehýbe, hlídají to dva E2E testy.

| Kontrast (WCAG) | Poměr |
| --- | --- |
| Text tlačítka (papír na kobaltu) | 5,8 : 1 |
| Odkaz-výzva a hrana tlačítka proti papíru (nutné 3 : 1) | 5,8 : 1 |
| Vedlejší text (muted) na papíře / na kartě | 6,0 : 1 / 6,5 : 1 |
| Světlý text v děkovacím bloku | 10,0 : 1 |

**Snímky** na 375 × 812 (skript [`scripts/screens.mjs`](scripts/screens.mjs), server s testovacími proměnnými, cookie lišta odmítnutá):

| Stav | Před | Po |
| --- | --- | --- |
| Hero A | [pred/1-hero-a.png](docs/screens/pred/1-hero-a.png) | [po/1-hero-a.png](docs/screens/po/1-hero-a.png) |
| Výsledek kalkulačky | [pred/2-vysledek-kalkulacky.png](docs/screens/pred/2-vysledek-kalkulacky.png) | [po/2-vysledek-kalkulacky.png](docs/screens/po/2-vysledek-kalkulacky.png) |
| Srovnání | [pred/3-srovnani.png](docs/screens/pred/3-srovnani.png) | [po/3-srovnani.png](docs/screens/po/3-srovnani.png) |
| Děkovací stav | [pred/4-dekovaci-stav.png](docs/screens/pred/4-dekovaci-stav.png) | [po/4-dekovaci-stav.png](docs/screens/po/4-dekovaci-stav.png) |
| Hero B | [pred/5-hero-b.png](docs/screens/pred/5-hero-b.png) | [po/5-hero-b.png](docs/screens/po/5-hero-b.png) |

U děkovacího stavu skript zadrží odeslání v prohlížeči, aby se nic neuložilo. Snímek „po“ proto ukazuje stav načítání („Ukládáme adresu…“), snímek „před“ text, který se dřív ukazoval hned.

**Slova na první obrazovce** (375 × 812, jen slova opravdu vidět, nezakrytá lištou):

| | S cookie lištou: před → po | Bez lišty: před → po |
| --- | --- | --- |
| Hero A | 107 → 96 (−10 %) | 84 → 74 (−12 %) |
| Hero B | 101 → 94 (−7 %) | 78 → 72 (−8 %) |

**LCP a CLS** (produkční build s testovacími proměnnými, 375 × 812, síť 150 ms / 1,6 Mb/s, CPU 4× zpomalené, medián z 5 běhů, cookie lišta zobrazená; změřeno Playwrightem přes `PerformanceObserver`, ne Lighthouse):

| | LCP před → po | CLS před → po |
| --- | --- | --- |
| Hero A | 736 → 696 ms | 0 → 0 |
| Hero B | 2 592 → 708 ms | 0 → 0 |

Hero B měl před krokem 8b LCP 2,6 s. Příčinu jsme nezkoumali. Po změně písma je LCP u obou variant pod 0,75 s. Lokální měření nenahrazuje Lighthouse na nasazené stránce (15. 10.).

## Očekávaná konverze

**Odhad: 4 % zobrazení stránky skončí leadem a 2 % potvrzeným leadem.** Rozpětí: 2–6 % leadů. Kromě benchmarku níže jsou všechna čísla **vlastní předpoklad**. Ověřená data pro tento typ stránky a publika v ČR nemáme. Odhad nahradí čísla z prvního týdne kampaně.

### Benchmark

[Unbounce – Conversion Benchmark Report 2024](https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate/), data za 23. 7. 2023 – 23. 7. 2024, 41 000 landing pages a 57 milionů konverzí ([tisková zpráva 5. 9. 2024](https://www.newswire.ca/news-releases/unbounce-s-2024-conversion-benchmark-report-proves-that-attention-spans-are-declining-and-so-are-conversion-rates-831617439.html)). Staženo 2026-10-10.

| Medián konverze | Hodnota |
| --- | --- |
| Všechna odvětví | 6,6 % |
| Finanční služby | 8,3 % |
| – z toho pojištění | 18,2 % |
| – z toho úvěry | 8,8 % |
| – **z toho investice** | **3,9 %** |
| Finanční služby, placené sociální sítě | 9,3 % (Facebook 10,1 %, Instagram 15,5 %) |

**Proč kotvíme na 3,9 % (investice), ne na 8,3 %:** finanční medián táhne nahoru pojištění (18,2 %), které s naším tématem nesouvisí. Unbounce navíc počítá jako konverzi i proklik, ne jen odeslaný formulář, a celosvětová data nejsou česká. 9,3 % u sociálních sítí platí pro finance celkem, ne pro investice. Proto bereme 4 %, což je zhruba medián investic. Hodnota nahoru i dolů je stejně možná: proti nám hraje studené publikum z feedu, pro nás formulář s jediným polem a hodnota ukázaná před žádostí.

### Rozpad funnelu (vlastní předpoklad)

Podíly jsou z návštěvníků, kteří stránku opravdu viděli (zobrazení stránky). Kroky odpovídají eventům v [Měření](#měření).

| Krok | Event | Z prokliků | Ze zobrazení | Z předchozího kroku | Proč |
| --- | --- | --- | --- | --- | --- |
| Proklik z reklamy | (Meta: link click) | 100 % | – | – | |
| Zobrazení stránky | `page_view` (Meta: landing page view) | 80 % | 100 % | 80 % | Část lidí odejde, než se stránka v prohlížeči Facebooku/Instagramu načte. Stránka je statická (LCP cíl < 2,5 s), takže ztráta by měla být malá |
| Interakce s kalkulačkou | `calc_start` | 28 % | 35 % | 35 % | Hero A vede tlačítkem přímo na kalkulačku, hero B na srovnání, takže u B bude nižší. Část lidí z feedu stránku jen proletí |
| Zobrazení formuláře | `form_view` | 24 % | 30 % | – | Formulář je čtvrtý v pořadí. Kdo došel až sem, prošel kalkulačku nebo srovnání. Event počítá i ty, kdo kalkulačku přeskočili |
| **Lead** | `form_submit` | **3,2 %** | **4 %** | 13 % z `form_view` | Kotva na benchmarku investic (3,9 %) |
| **Potvrzený lead** | `lead_confirmed` | **1,6 %** | **2 %** | 50 % z leadů | Ověřený benchmark pro míru potvrzení double opt-in jsme nenašli (jen blogy bez metodiky). Volíme 50 %, protože srovnání návštěvník dostane už na stránce, takže k potvrzení e-mailu má slabší motivaci. Tlačítko v e-mailu proto zní „Potvrdit a otevřít srovnání“ |

### Cena za lead (vlastní předpoklad)

Cenu prokliku (CPC) pro finance na Meta v ČR z ověřeného zdroje nemáme, proto tři scénáře. Lead = 3,2 % prokliků, potvrzený lead = 1,6 % prokliků.

| CPC | Cena za lead | Cena za potvrzený lead | Testovací rozpočet 4 200 Kč na variantu → leadů |
| --- | --- | --- | --- |
| 5 Kč | 156 Kč | 313 Kč | 27 |
| 10 Kč | 313 Kč | 625 Kč | 13 |
| 20 Kč | 625 Kč | 1 250 Kč | 7 |

Výpočet: cena za lead = CPC / 0,032, potvrzený = CPC / 0,016, leady = 4 200 / CPC × 0,032 (zaokrouhleno).

### Jak se konverze změří

| Metrika | Čitatel | Jmenovatel | Poznámka |
| --- | --- | --- | --- |
| Lead / zobrazení stránky podle reklamy | Supabase: počet řádků v `leads` podle `ad_variant` a `utm_content` (SQL v [Měření](#měření)) | Meta Ads Manager: *landing page views* podle reklamy | Obě čísla jsou úplná a nezávisí na cookies. Podle tohoto poměru se rozhoduje |
| Potvrzený lead / lead | Supabase: `count(double_opt_in_at)` | Supabase: `count(*)` | Exportovat do 30 dnů, nepotvrzené se pak mažou |
| Odpady mezi kroky | PostHog: funnel 8 eventů, rozpis podle `ad_variant` | – | Jen návštěvníci, kteří povolili měření. Souhlasící se mohou chovat jinak než ostatní (neměřili jsme), takže brát jako orientační poměry, ne absolutní čísla |
| CTR, CPC, landing page views | Meta Ads Manager | – | Rozpis podle umístění (feed / Stories) |

## Hypotézy pro A/B test

Seřazené podle očekávaného dopadu na počet leadů. Odhady zlepšení jsou **vlastní předpoklad**, ověřené benchmarky pro tyto změny nemáme.

### Výpočet vzorku

Test dvou podílů, oboustranný, α = 0,05, síla 80 %:

```
n = ( z_α/2 · √(2 · p̄ · (1 − p̄)) + z_β · √(p1 · (1 − p1) + p2 · (1 − p2)) )² / (p1 − p2)²
p̄ = (p1 + p2) / 2,   z_α/2 = 1,96,   z_β = 0,84
```

- `n` = počet **zobrazení stránky na variantu**.
- Přepočet na prokliky: `n / 0,8` (80 % prokliků se zobrazí, [Očekávaná konverze](#očekávaná-konverze)).
- Cena: prokliky × CPC. Počítáme s CPC 10 Kč, vlastní předpoklad (prostřední scénář).
- Zopakovat: `node scripts/sample-size.mjs` (všechny případy níže), nebo `node scripts/sample-size.mjs 0.04 0.06`.

| Hypotéza | p1 → p2 (relativně) | n zobrazení na variantu | Prokliků na variantu | Kč na variantu (CPC 10) | Dní při 300 Kč/den | Dní při 1 500 Kč/den |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | 4 % → 6 % (+50 %) | 1 863 | 2 329 | 23 290 | 78 | 16 |
| H1 | 4 % → 5,2 % (+30 %) | 4 783 | 5 979 | 59 790 | 200 | 40 |
| H2 | 4 % (kontrola: původní odkaz) → 5 % (výchozí: formulář pod výsledkem) (+25 %) | 6 745 | 8 432 | 84 320 | 282 | 57 |
| H3 | 35 % → 40,25 % (+15 %), jen souhlasící | 1 336 souhlasících = 2 672 zobrazení | 3 340 | 33 400 | 112 | 23 |

**Co z toho plyne:** testovací rozpočet z [`ads/`](ads/README.md#cílení-a-rozpočet-obě-varianty-stejně) (300 Kč denně na variantu, 7 dní) rozliší CTR a cenu prokliku, ale **rozdíl v leadech ne**. Test na leady potřebuje zhruba 1 500 Kč denně na variantu a 2–8 týdnů, podle toho, jak velký rozdíl chceme poznat. Menší rozdíly prakticky nezměříme: +10 % (4 % → 4,4 %) by chtělo 39 475 zobrazení na variantu. Proto testujeme jen změny, od kterých čekáme velký účinek.

### H1: Reklama A (úspora) vs. B (zvědavost) včetně jejich hero

- **Co měníme:** celou dvojici reklama + hero. A slibuje konkrétní číslo (44 200 Kč) a vede na kalkulačku, B klade otázku (proč ne VOO) a vede na srovnání.
- **Testuje kombinaci reklama + hero, ne jen kreativu.** Každá reklama vede na vlastní hero, takže výsledek neřekne, jestli vyhrála reklama, nebo hero. Na to by byl potřeba další test (stejná reklama, dvě hero).
- **Proč čekáme velký rozdíl:** obě varianty přivedou jiné lidi s jiným záměrem. A oslovuje ty, kdo řeší náklady (a kalkulačka jim dá osobní číslo). B oslovuje zvědavé, kteří o VOO slyšeli. U B čekáme vyšší CTR (otázka), u A vyšší podíl leadů (konkrétní hodnota a cesta přes kalkulačku). Na čem záleží: **lead na proklik**, ne CTR. Odhad rozdílu +50 % je vlastní předpoklad.
- **Metrika:** primární lead / zobrazení stránky (Supabase podle `ad_variant` / Meta landing page views). Sekundární: cena za lead, potvrzený lead / lead, CTR.
- **Vzorek:** 1 863 zobrazení na variantu pro +50 %, 4 783 pro +30 %.
- **Spuštění:** už připravené. Dvě reklamy s `utm_content=a-uspora` a `b-zvedavost`. `proxy.ts` vybere hero a stránka uloží `ad_variant`. V Meta rovnoměrné rozdělení publika přes funkci A/B test v Ads Manageru, ne dvě reklamy v jedné sadě, kde by Meta mohla rozpočet sama přesunout k jedné z nich. Konkrétní nastavení ověřit v Ads Manageru.

### H2: Formulář hned pod výsledkem kalkulačky (výchozí stav) vs. odkaz na formulář za srovnáním

- **Výchozí stav se změnil (krok 8a, rozhodnutí 45):** formulář pod výsledkem kalkulačky je na stránce už teď. Test proto ověřuje, jestli si to rozhodnutí obhájí v datech.
- **Kontrola:** původní stav. Pod výsledkem kalkulačky je jen pruh „Chcete kompletní srovnání…“ s odkazem na formulář, který je až za ukázkou srovnání.
- **Varianta:** dnešní výchozí stav. Pole pro e-mail je přímo pod výsledkem a dole zůstane jen tlačítko, které vede nahoru.
- **Proč čekáme zlepšení:** výsledek kalkulačky je chvíle největšího zájmu (rozhodnutí 4). Každý posun a sekce navíc mezi výsledkem a formulářem jsou příležitost odejít.
- **Riziko:** návštěvník může odeslat e-mail dřív, než uvidí ukázku srovnání. Neví pak přesně, co dostane, a může vyjít horší míra potvrzení, i když leadů přibude.
- **Odhad +25 % je vlastní předpoklad:** kontrola 4 % → varianta 5 %. Odhad 4 % v [Očekávané konverzi](#očekávaná-konverze) jsme nechali beze změny. Vychází z benchmarku, ne z této hypotézy, a zvýšit ho na 5 % by znamenalo počítat s neověřeným výsledkem.
- **Metrika:** primární lead / zobrazení stránky (Supabase podle `utm_content`). Sekundární:
  - potvrzený lead / lead (Supabase), hlídá riziko výše,
  - `form_submit / calc_result` a `form_submit` podle `form_location` (PostHog, jen souhlasící).
- **Vzorek:** 6 745 zobrazení na variantu. Výpočet je symetrický, takže pro 4 % ↔ 5 % vychází stejně v obou směrech (`node scripts/sample-size.mjs 0.05 0.04`). Ze tří testů nejdražší, proto až po H1 a jen na vítězné reklamě.
- **Spuštění (potřebuje kód):**
  - Kontrolní varianta v `utm_content`, např. `a-uspora-f1` (původní odkaz). Bez přípony nebo s `-f2` zůstává dnešní výchozí stav.
  - `proxy.ts` podle přípony přepíše na staticky předrenderovanou stránku (jako dnes `/v/b`) a `Calculator` dostane parametr `leadPlacement="link"`. Ten místo formuláře vykreslí původní pruh s odkazem a spodní formulář zůstane aktivní.
  - `ad_variant` zůstává `a`/`b` a tabulka `leads` se nemění: `utm_content` se ukládá už teď, takže stačí `group by utm_content`.
  - V Meta dvě kopie vítězné reklamy s různým `utm_content` v A/B testu.
  - PostHog feature flags nepoužíváme, protože bez souhlasu s měřením se PostHog nenačte (rozhodnutí 33) a varianta by se nevybrala.

### H3: Hero A s posuvníkem částky přímo v hero vs. tlačítko „Spočítat pro mě“

- **Co měníme:** v hero A místo tlačítka jeden posuvník „Měsíčně investuji“. Číslo 44 200 Kč se přepočítá hned, plná kalkulačka zůstává níž.
- **Proč čekáme zlepšení:** interakce bez kliknutí a posunu stránky. Návštěvník uvidí svoje číslo v první obrazovce. Riziko: hero přestane být jedna zpráva a jedno číslo, a jakmile návštěvník posune, číslo přestane odpovídat slibu reklamy (2 000 Kč). Výchozí hodnota proto musí zůstat 2 000 Kč. Odhad +15 % je vlastní předpoklad.
- **Metrika:** primární `calc_start / page_view` (PostHog, jen souhlasící). Na leady by test potřeboval vzorek jako H2. Sekundární: lead / zobrazení stránky (Supabase).
- **Vzorek:** 1 336 **souhlasících** návštěvníků na variantu. Podíl souhlasu s měřením zatím neznáme. Při předpokladu 50 % (vlastní, nahradit skutečným podílem z prvního týdne) to je 2 672 zobrazení.
- **Spuštění (potřebuje kód):** stejně jako H2 přes příponu `utm_content` (`a-uspora-h1` / `a-uspora-h2`) a staticky předrenderovanou variantu. E2E testy: číslo v hero při výchozí hodnotě stále 44 200 Kč, tlačítko a vstup nad ohybem i na 375 × 667 s cookie lištou.

**Pravidla pro všechny testy:** vždy jen jeden test naráz na stejném publiku. Délku určit předem podle vzorku a neukončovat test dřív, jakmile se objeví „vítěz“. Vždy aspoň celý týden kvůli rozdílu mezi pracovními dny a víkendem. Výsledky z PostHogu (jen souhlasící) brát jako doplněk k Supabase.

## Měření

Funnel: `page_view → hero_cta_click → calc_start → calc_result → compare_view → form_view → form_submit → lead_confirmed`. Každý event nese `ad_variant` (`a`/`b`) a UTM parametry z URL ([`lib/track.ts`](lib/track.ts)).

- **`form_location`:** `form_view` a `form_submit` nesou místo formuláře, `calc` (pod výsledkem kalkulačky) nebo `bottom` (spodní sekce). `form_view` se posílá jednou za návštěvu, takže říká, který formulář návštěvník uviděl jako první.
- **`form_cta_click`:** event mimo funnel pro tlačítko „Poslat mi srovnání“ ve spodní liště (`cta: "sticky"`). `hero_cta_click` by po výsledku kalkulačky rozbil pořadí funnelu.
- **`compare_view` není povinný krok:** od kroku 8a jde formulář odeslat hned pod výsledkem, bez srovnání. Pořadí výše je pořadí sekcí na stránce, ne cesta, kterou musí každý projít.

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

Funnel v PostHogu: Product analytics → New insight → Funnels, dva funnely s breakdownem podle `ad_variant` nebo `form_location`:

- `page_view → form_view → form_submit` pro všechny,
- `page_view → calc_result → form_view → form_submit` pro cestu přes kalkulačku (hero B kalkulačku často přeskočí). `compare_view` do funnelu nepatří: v přísném pořadí by z něj vypadli všichni, kdo odeslali formulář pod výsledkem bez srovnání. Podíl `compare_view / page_view` sledovat jako samostatný trend. Krok `lead_confirmed` přichází často z jiného zařízení (e-mail na mobilu) a v rámci jedné návštěvy se nepropojí. Míru potvrzení proto počítáme z databáze.

**Co PostHog dostane:** jen eventy funnelu s `ad_variant` a UTM, plus technické údaje, které přikládá sám (adresa stránky, prohlížeč, zařízení, obrazovka). Nedostane e-mail (žádné `identify`), autocapture, záznam obrazovky ani tokeny z odkazů v e-mailech (`stripSecrets` v [`lib/analytics.ts`](lib/analytics.ts)).

**Reklamní pixely (návrh, neimplementováno):** samostatná kategorie souhlasu `ads` (připravená v [`lib/consent.ts`](lib/consent.ts), v liště se zobrazí až s pixely).
- Google Ads: Consent Mode v2 s výchozím `denied` pro `ad_storage`, `ad_user_data`, `ad_personalization` a `analytics_storage`, po souhlasu `update` na `granted`.
- Meta Pixel: načte se až po souhlasu `ads`.
- Meta Conversions API ze `submitLead`: event `Lead` s `event_id` pro deduplikaci s pixelem, jen pokud návštěvník souhlasil s `ads`. Hashovaný e-mail jen s tímto souhlasem.
- Zásady i lišta se musí doplnit o pojmenované příjemce (Meta, Google).

## Reklamy

Dvě reklamy pro Meta (Facebook, Instagram), každá s vlastním hero. Texty, vizuály 1:1, 4:5 a 9:16, cílení, rozpočet, pravidla platforem a právní kontrola jsou v [`ads/`](ads/README.md).

| | A – úspora | B – zvědavost |
| --- | --- | --- |
| Slib | Při 2 000 Kč měsíčně je rozdíl v poplatcích fondů za 20 let přes 40 000 Kč – i bez výnosu | Proč si v Česku nekoupíte VOO? A jaké alternativy jsou v ČR dostupné |
| Hero | číslo 44 200 Kč (ESMA, výnos 0 %) → kalkulačka | VOO ↔ VUAA, chybějící KID → srovnání |
| `utm_content` | `a-uspora` | `b-zvedavost` |
| Vizuál | [feed 4:5](ads/a-uspora/feed-4x5.png) | [feed 4:5](ads/b-zvedavost/feed-4x5.png) |

- **Reklama říká totéž co hero.** Každé tvrzení má protějšek v hero (tabulky v [`ads/a-uspora/README.md`](ads/a-uspora/README.md) a [`ads/b-zvedavost/README.md`](ads/b-zvedavost/README.md)). Čísla hlídá unit test [`lib/ads.test.ts`](lib/ads.test.ts) proti stejnému výpočtu, ze kterého je hero.
- **Každé číslo má podmínku hned u sebe:** v nadpisu, popisu i vizuálu, ne jen v jiném poli. Nadpis A proto začíná „2 000 Kč/měs., 20 let:“, protože se v některých umístěních zobrazí bez primárního textu.
- **Vizuály jsou HTML šablony** ve stylu stránky („Výpis z účtu 2.0“: stejné tokeny a písma), renderované do PNG Playwrightem (`npm run render-ads`). Pozvánka na stránku je jen typografický řádek, žádné falešné tlačítko (pravidlo Meta).

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
| Firefox s rozšířenou ochranou proti sledování (výchozí v anonymním okně) | Bez proxy ✗ blokuje `eu.i.posthog.com`, požadavky končí „CORS Failed“ a data **nedorazí, i když návštěvník souhlasil**. Po vypnutí ochrany stav 200. ✓ **opraveno proxy, ověřeno:** přes reverse proxy `/ingest` (rozhodnutí 40) ve stejném okně po „Povolit měření“ `POST /ingest/e/` → 200 a eventy dorazily do PostHogu (Activity) |

### Ruční ověření: produkce (krok 6)

Na https://etf-srovnani.vercel.app. Vyplní se na konci projektu, po úpravě textů a designu.

| # | Kontrola | Jak | Výsledek |
| --- | --- | --- | --- |
| 1 | Region funkcí | `curl -sI -X POST "https://etf-srovnani.vercel.app/api/odhlaseni?u=x"` → hlavička `x-vercel-id` končí na `fra1::…` (nebo Deployment → Functions) | |
| 2 | noindex | `curl -s https://etf-srovnani.vercel.app/potvrzeni \| grep -o '<meta name="robots"[^>]*>'`, totéž pro `/odhlaseni`, `/zasady`, `/v/b`. `/` noindex mít nesmí | |
| 3 | Hero B | `/?utm_content=b-zvedavost` ukáže variantu B (proxy na Vercelu) | |
| 4 | Odeslání formuláře | z mobilu s `?utm_source=test&utm_content=b-test`. V Supabase řádek s `ad_variant`, `utm_*`, `consent_text`, `calc_input`, `calc_result` | |
| 5 | E-mail a odkazy | dorazí do Gmailu. Odkazy na potvrzení a odhlášení vedou na `https://etf-srovnani.vercel.app`, ne na localhost | |
| 6 | Potvrzení | tlačítko na `/potvrzeni` vyplní `double_opt_in_at` | |
| 7 | One-click odhlášení v Gmailu | tlačítko „Odhlásit“ u odesílatele. U nového odesílatele s malým objemem ho Gmail nemusí ukázat, záložně: „Zobrazit originál“ → URL z `List-Unsubscribe` → `curl -X POST "<URL>"` → „Odhlášeno.“. V DB je pak souhlas s novinkami odvolaný (zároveň ověří `marketing_audience`) | |
| 8 | Cookie lišta a `/ingest` | před volbou a po „Odmítnout“ žádný požadavek na `/ingest`. Po „Povolit měření“ `POST /ingest/e/` → 200 a event v PostHogu (Activity). Totéž ve Firefoxu v anonymním okně | |
| 9 | Poloha u eventu v PostHogu | `$geoip_country_code` / `$geoip_city_name` u eventu: ČR, poloha serveru Vercelu (Frankfurt/USA), nebo nic (kvůli „Discard client IP data“) | |
| 10 | DMARC | `dig +short TXT _dmarc.mail.hosek.cc` vrátí záznam. V Gmailu „Zobrazit originál“: SPF, DKIM i DMARC PASS | |
| 11 | Lighthouse na mobilu | PageSpeed Insights, mobil: Performance, LCP (cíl < 2,5 s), CLS, Accessibility, datum měření | |

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
41. **Serverové funkce ve Frankfurtu (`fra1`), nastavené ve [`vercel.json`](vercel.json).** Výchozí region nových projektů na Vercelu je Washington (`iad1`). Supabase je ve Frankfurtu, takže `fra1` zkracuje cestu k databázi a osobní údaje z formuláře zpracovává server v EU. Region je ve `vercel.json`, ne jen v dashboardu, aby byl vidět v repu a verzoval se. Route segment config `preferredRegion` je v Next.js 16 deprecated (dokumentace v `node_modules/next`), proto ne v kódu. Hobby plán povoluje jeden region, `fra1` tedy stačí.
    - **Ve `fra1` běží:** Server Actions (odeslání formuláře, potvrzení, kvalifikační otázka), `/api/odhlaseni` a odeslání e-mailu přes `after()`.
    - **Mimo `fra1`:** statické stránky jdou z CDN Vercelu nejblíž návštěvníkovi. `proxy.ts` (výběr hero podle `utm_content`) Vercel nasazuje do všech regionů bez ohledu na nastavení, ale čte jen `utm_content` a nic neukládá. Rewrite `/ingest` do PostHog EU obsluhuje CDN.
42. **Reklamy na Meta deklarují speciální kategorii *Financial products and services*, i když pro ČR není výslovně povinná.** Dokumentace Meta ji povinně vyžaduje u reklam zasahujících USA. U Evropy zmiňuje jen úvěrové reklamy („certain parts of Europe“) bez seznamu zemí. Investice a ETF do kategorie tématicky spadají a reklamu bez vhodné kategorie může Meta zamítnout. Cena: věk je pevně 18–65+, takže personu 25–45 let nejde zacílit, bez lookalike publik a zájmy jen ze schváleného seznamu. Personu zasáhnou zájmy a kreativa. Podrobně v [`ads/README.md`](ads/README.md#cílení-a-rozpočet-obě-varianty-stejně).
43. **V reklamě B se nejmenuje žádný UCITS fond.** VUAA a jeho TER návštěvník uvidí až na stránce. Reklama tak nepropaguje konkrétní nástroj a netvrdí jeho dostupnost v ČR (`registered_in_cz` u VUAA = null). Hlídá unit test.
44. **Text reklamy A je v prvním odstavci zkrácený:** „i bez výnosu“ místo „i bez jakéhokoli výnosu“, aby se podmínka i „Modelový výpočet, ne doporučení“ vešly do 125 znaků. Tolik doporučuje Meta Ads Guide pro primární text a zbytek se může schovat za „Zobrazit více“. Věcně se nic nemění.
45. **Formulář je hned pod výsledkem kalkulačky, ne až za srovnáním** (krok 8a, designová revize). Okamžik nejvyššího zájmu je výsledek kalkulačky (rozhodnutí 4). Dřív tam byl jen odkaz a návštěvník musel přeskočit ukázku srovnání. Původně to byla hypotéza H2, teď je to výchozí stav a H2 testuje původní odkaz jako kontrolu.
    - **Rozdíl v Kč i pole pro e-mail na jedné obrazovce** (375 × 812 i 667, hlídá E2E test). Souhrnný řádek „Rozdíl“ je proto nahoře v účtence. Vklady a náklady podle TER jsou v rozpisu, který je na mobilu sbalený.
    - **Předpoklady výpočtu se nesbalují:** výnos jako příklad, co výpočet nezahrnuje, zdroje. Podle právních mantinelů musí být vidět.
    - **Formulář pod výsledkem se chová stejně jako ten dole:** stejný souhlas, GDPR text, honeypot, časová past i `submitLead`. Tlačítko říká, co návštěvník dostane („Poslat mi srovnání“), ne otázku.
46. **Na stránce je vždy jen jeden aktivní formulář.** Před výsledkem kalkulačky je aktivní spodní formulář (hero B kalkulačku přeskočí). Po výsledku je aktivní formulář pod ním a dole zůstane jen tlačítko, které vede nahoru a dá focus do pole.
    - **Výjimka:** kdo už psal do spodního formuláře, tomu zůstane aktivní, aby nepřišel o rozepsaný e-mail.
    - Odkaz u zamčených dvojic i spodní lišta vedou vždy do aktivního formuláře, nikdy na mezikrok.
47. **Po odeslání jsou obě místa v děkovacím stavu, plné srovnání je jen jedno.** Zobrazí se tam, kde návštěvník formulář odeslal, na druhém místě je krátké „Plné srovnání už máte“ s odkazem. Dvakrát pět dvojic by stránku zbytečně prodloužilo a ID nadpisů a kotev zdrojů by se opakovala. Stav sdílí [`lib/lead-flow.ts`](lib/lead-flow.ts).
48. **Srovnání má přepínač SPY / VOO / IVV, výchozí VOO.** Jedna karta místo tří zkrátila sekci z 1 755 na 880 px.
    - **Proč VOO:** navazuje na hero a reklamu B („Proč si v Česku nekoupíte VOO?“).
    - **Přístupnost:** přepínač je WAI-ARIA tabs, ovládá se šipkami, Home a End.
    - **Data zůstávají na serveru:** karty se vykreslují na serveru i se zdroji, přepínač je jen skrývá.
    - **Zamčené dvojice VTI a VT** jsou na jednom řádku. Popis plné verze je ve spodní sekci formuláře.
49. **Do rozbalovacích polí jde vše kromě rizik a podmínek u čísel, se třemi výjimkami.** Zdroje u srovnání, metodika kalkulačky a odstavce „Odkud jsou data“ a „Kdo za stránkou stojí“ jsou sbalené. Horní index u hodnoty zdroj rozbalí. Vidět zůstávají:
    - **text o GDPR u formuláře:** správce, účel a právní základ musí být u formuláře,
    - **údaje o provozovateli v patičce:** povinné,
    - **odstavec o PRIIPs/KID ve srovnání:** je to odpověď, kterou slibuje reklama B. Nechali jsme ho beze změny, protože jde o právní tvrzení.
    - V hero A je zdroj (ESMA, data za rok 2024) přímo v podmínce u čísla. Rozbalovací pole by na 375 × 667 posunulo CTA pod cookie lištu. Datum stažení je v „Jak počítáme“ u kalkulačky.
50. **Tlačítka cookie lišty zůstávají neutrální.** Kobaltová „Povolit měření“ by byla dark pattern a porušila by pravidlo „odmítnout stejně snadno jako přijmout“. Neutrální jsou i tlačítka kvalifikační otázky a „Odhlásit se“, protože nejsou výzvou ke konverzi.
51. **Fraunces s pevnou optickou velikostí `opsz 48`.** Automatická optická velikost volila u 104 px kontrastnější řez než u 34 px. Pevná hodnota sjednotí nadpisy hero A, B a reklam.
52. **Tabulkové číslice i za cenu přeškrtnuté nuly.** Atkinson Hyperlegible Next má ve výchozím stavu přeškrtnutou nulu. Obyčejnou nulu dává funkce `salt`, ale jen u proporcionálních číslic: s `tnum` zůstává přeškrtnutá (ověřeno renderem). Zadání chce tabulkové číslice, takže je necháváme. **K rozhodnutí designera:** ve velkých částkách („44 200 Kč“) může přeškrtnutá nula působit rušivě. Alternativa: proporcionální číslice se `salt` jen pro samostatná velká čísla (hero, reklamy), tabulkové v tabulkách.

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
- **Hobby plán Vercelu je jen pro nekomerční osobní užití.** Podle Fair Use Guidelines Vercel za komerční užití považuje mimo jiné „Advertising the sale of a product or service“ a placenou tvorbu webu. Ukázka do výběrového řízení na Hobby být může, **ostrá kampaň pro klienta potřebuje Pro** (mimo jiné až 5 regionů funkcí místo 1). Spolu s Pro plánem Supabase a placeným Resend to patří do rozpočtu spuštění.
- **Region `fra1` ověřit na produkci** (rozhodnutí 41, checklist produkce bod 1).
- **Lhůta uložení potvrzených adres a příjemci údajů** v zásadách: musí doplnit provozovatel.
- **Migrace se spouští ručně** v SQL editoru Supabase (bez Supabase CLI). Logika SQL funkcí byla během vývoje ověřena v PGlite (Postgres ve WASM): upsert, práva rolí, mazání po 30 dnech, opakované spuštění.
- **Zásady Meta pro finanční produkty** jsme nenačetli (stránka se nástrojem nenačte). Před spuštěním kampaně je musí přečíst člověk, včetně ověření inzerenta.
- **Kampaň na Meta optimalizuje na prokliky, ne na leady.** Bez pixelu a Conversions API (navržené, neimplementované) Meta neví, kdo odeslal formulář. Leady podle varianty počítáme v Supabase.
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
| Regiony funkcí, limit Hobby = 1 region, middleware ve všech regionech | Vercel Docs – Configuring regions for Vercel Functions | [vercel.com](https://vercel.com/docs/functions/configuring-functions/region) | 2026-10-10 |
| Hobby jen pro nekomerční užití | Vercel Docs – Fair Use Guidelines, Commercial usage | [vercel.com](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage) | 2026-10-10 |
| Speciální kategorie reklam na Meta, omezení cílení | Meta Marketing API – Special Ad Categories | [developers.facebook.com](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category) | 2026-10-10 |
| Délky textů a ochranné zóny reklam na Meta | Meta Ads Guide – Instagram feed, Facebook feed, Instagram Stories | [facebook.com/business/ads-guide](https://www.facebook.com/business/ads-guide/update/image/instagram-story) | 2026-10-10 |
| Ověření finančních inzerentů v Google Ads (ČR) | Google Advertising Policies Help – červen 2026 a Financial Services Verification | [support.google.com](https://support.google.com/adspolicy/answer/17127726?hl=en), [ČR](https://support.google.com/adspolicy/answer/15332527?hl=en&co=GENIE.CountryCode%3DCZ) | 2026-10-10 |
| Benchmark konverze landing pages (finanční služby, investice, placené sociální sítě) | Unbounce – Conversion Benchmark Report 2024 (data 23. 7. 2023 – 23. 7. 2024) | [unbounce.com](https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate/), [tisková zpráva](https://www.newswire.ca/news-releases/unbounce-s-2024-conversion-benchmark-report-proves-that-attention-spans-are-declining-and-so-are-conversion-rates-831617439.html) | 2026-10-10 |

## Právní upozornění

Stránka je vzdělávací srovnání s daty, ne investiční doporučení ani nabídka produktu. Tento projekt není právní rada; **před ostrým spuštěním je nutná právní kontrola** (PRIIPs, MAR/ZPKT, MiFID II, GDPR, zákony 40/1995, 634/1992, 480/2004 a 127/2005).

Rizika pro „spuštění zítra“ na straně reklamních platforem (ověřeno 2026-10-10, zdroje v [`ads/README.md`](ads/README.md#pravidla-platforem-ověřeno-2026-10-10)):
- **Google Ads** vymáhá ověření finančních inzerentů v ČR od 23. 7. 2026 (kategorie mimo jiné *Investment*). Web, který finanční službu nenabízí, ale cílí na lidi, kteří ji hledají, žádá přes G2 jako nefinanční inzerent: popíše důvod a zaručí se, že nebude propagovat finanční služby. Schválení není okamžité. Google Ads proto v tomto projektu nepřipravujeme.
- **Meta:** speciální kategorie *Financial products and services* omezuje cílení (rozhodnutí 42). Zásady pro finanční produkty mohou vyžadovat licenci a ověření identity inzerenta. Stránku zásad jsme nástrojem nenačetli a **před spuštěním ji musí přečíst člověk**.
- **Inzerent potřebuje skutečného provozovatele** (název, IČO, sídlo). Ten ukázkovému projektu chybí.

Hosting: stránka běží na Hobby plánu Vercelu, který je jen pro nekomerční užití. Ostrá kampaň vyžaduje Pro.

## Spuštění lokálně

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm test             # unit testy výpočtu (Vitest)
npm run check-data   # kontrola zdrojů v data/
npm run render-ads   # vizuály reklam ads/*/ad.html → PNG (potřebuje síť kvůli fontům)
node scripts/sample-size.mjs   # vzorek pro A/B test (README, Hypotézy)
npx playwright install --with-deps chromium   # jednou
npm run e2e          # Playwright, mobil 375 px (ostré služby nevolá, viz e2e/test-env.mjs; port 3100 musí být volný)
node scripts/page-height.mjs   # výška stránky na 375 px (vlastní testovací server na portu 3101)
```

### Nastavení služeb

1. `cp .env.example .env.local` a doplnit hodnoty podle komentářů v souboru. `.env.local` se necommituje.
2. Supabase: v SQL Editoru spustit postupně celé soubory z [`supabase/migrations/`](supabase/migrations/) podle názvu (`20261009_leads.sql`, pak `20261009_leads_double_opt_in.sql`). Když selže `create extension pg_cron`, zapnout Cron v Dashboardu (Integrations → Cron) a spustit zbytek souboru.
3. Resend: ověřená doména (zde `mail.hosek.cc`), API klíč s právem Sending access. `SITE_URL` je adresa, na kterou vedou odkazy v e-mailu.
4. Na Vercelu nastavit stejné proměnné, viz [Nasazení na Vercel](#nasazení-na-vercel).

Variantu hero B zobrazíte přes `/?utm_content=b-zvedavost`.

## Nasazení na Vercel

Produkce: https://etf-srovnani.vercel.app, Hobby plán, serverové funkce ve Frankfurtu (`fra1`, [`vercel.json`](vercel.json), rozhodnutí 41).

Proměnné prostředí (Settings → Environment Variables) jsou nastavené **jen pro Production**. Náhledové deploye (Preview) tak nezapisují do ostré databáze a neposílají e-maily s odkazy na produkci. Formulář v nich projde, ale lead se neuloží. Změna proměnné se projeví až v dalším deployi.

| Proměnná | Typ | Čte se | Hodnota / poznámka |
| --- | --- | --- | --- |
| `SUPABASE_URL` | server | za běhu | `https://<ref>.supabase.co`. Není tajná, ale do prohlížeče nepatří |
| `SUPABASE_SECRET_KEY` | **tajná** (Sensitive) | za běhu | `sb_secret_…`, obchází RLS |
| `LEAD_TOKEN_SECRET` | **tajná** (Sensitive) | za běhu | vlastní hodnota pro produkci (`openssl rand -base64 32`). Změna zneplatní odkazy v odeslaných e-mailech |
| `RESEND_API_KEY` | **tajná** (Sensitive) | za běhu | Sending access, doména `mail.hosek.cc` |
| `EMAIL_FROM` | server | za běhu | `Srovnání ETF <srovnani@mail.hosek.cc>` |
| `SITE_URL` | server | za běhu | `https://etf-srovnani.vercel.app`, bez lomítka na konci. Ne `VERCEL_URL`, ta je pro každý deploy jiná. Bez ní se potvrzovací e-mail neodešle |
| `NEXT_PUBLIC_POSTHOG_KEY` | veřejná | **při buildu** | `phc_…`, vloží se do JavaScriptu v prohlížeči |
| `NEXT_PUBLIC_POSTHOG_HOST` | veřejná | **při buildu** | `https://eu.i.posthog.com`, cíl rewrite `/ingest` v [`next.config.ts`](next.config.ts) |

Výsledky ručních testů na produkci: [Ruční ověření: produkce](#ruční-ověření-produkce-krok-6).
