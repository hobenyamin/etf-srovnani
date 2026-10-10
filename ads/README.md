# Reklamy

Dvě verze reklamy pro Meta (Facebook a Instagram), na mobil a jen pro ČR. Jde o věcně správnou první verzi. Finální texty a vizuál doladí designer.

| Složka | Varianta | Hero na stránce | `utm_content` |
| --- | --- | --- | --- |
| [`a-uspora/`](a-uspora/) | A – úspora: „Při 2 000 Kč měsíčně je rozdíl v poplatcích fondů za 20 let přes 40 000 Kč – i bez výnosu.“ | A (číslo 44 200 Kč) | `a-uspora` |
| [`b-zvedavost/`](b-zvedavost/) | B – zvědavost: „Proč si v Česku nekoupíte VOO? A jaké alternativy jsou v ČR dostupné.“ | B (VOO ↔ UCITS) | `b-zvedavost` |

Každá složka obsahuje texty ([`copy.json`](a-uspora/copy.json) a README s počtem znaků), tabulku soulad reklama ↔ hero, šablonu vizuálu `ad.html` a PNG ve formátech 1:1, 4:5 a 9:16.

## Cílová URL a UTM

```
https://etf-srovnani.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf-srovnani-cz-2026-10&utm_content=<a-uspora|b-zvedavost>
```

- Stránka čte jen `utm_source`, `utm_medium`, `utm_campaign` a `utm_content` (`lib/visit.ts`). Hero vybírá `proxy.ts`: hodnota začínající `b` → hero B, cokoli jiného → hero A.
- Jedna reklama nese všechny tři formáty (přizpůsobení obsahu podle umístění), proto má jedno `utm_content` na variantu. Rozpad feed/stories ukáže Ads Manager (rozpis podle umístění).
- Dynamické parametry Meta (`{{placement}}` apod.) nepoužíváme. Stránka by je neuložila a do `utm_content` patří, protože podle něj se vybírá hero.

## Cílení a rozpočet (obě varianty stejně)

Cílení je u obou variant stejné, takže výsledek testu ovlivní jen reklama a její hero.

| Nastavení | Hodnota | Proč |
| --- | --- | --- |
| Speciální kategorie reklam | **Financial products and services**, deklarovat | Viz rozhodnutí níže |
| Lokalita | Česko, celá země | Kampaň jen pro ČR (rozhodnutí 6). V kategorii nejde vylučovat lokality |
| Věk | 18–65+ | V kategorii je věk pevný. Persona 25–45 let se nedá nastavit, zasáhnou ji zájmy a kreativa |
| Pohlaví | vše | V kategorii nejde volit |
| Jazyk | čeština | |
| Zájmy | např. investice, ETF, burza cenných papírů, osobní finance | Jen ze schváleného seznamu pro kategorii. Dostupnost konkrétních zájmů ověřit v Ads Manageru |
| Publika | bez vlastních a bez lookalike | Lookalike v kategorii nejsou. Vlastní publika zatím nemáme (pixel není nasazený) |
| Umístění | Advantage+ (feed, Stories, Reels), náhled každého formátu | Mobil |
| Cíl kampaně | Návštěvnost (prokliky na stránku) | Pixel a Conversions API zatím nejsou (README, Měření). Optimalizace na leady až po jejich nasazení |
| Rozpočet testu | 300 Kč denně na variantu, 7 dní = **4 200 Kč na variantu, 8 400 Kč celkem** | Vlastní předpoklad, viz níže |

**Rozpočet je vlastní předpoklad, ne benchmark.** Ověřený údaj o ceně prokliku finančních reklam na Meta v ČR jsme nenašli. Často citovaný WordStream (USA) nešel otevřít (HTTP 403), proto ho neuvádíme. Kolik prokliků 4 200 Kč přinese podle ceny prokliku (CPC):

| CPC | Prokliků na variantu |
| --- | --- |
| 5 Kč | 840 |
| 10 Kč | 420 |
| 20 Kč | 210 |

Sedm dní pokryje celý týden (víkend i pracovní dny). Takový test spolehlivě rozliší cenu prokliku a CTR. Na rozdíl v počtu **leadů** mezi variantami takový vzorek nestačí. Výpočet vzorku je v README (hypotézy A/B).

**Rozhodnutí: speciální kategorii deklarujeme, i když pro ČR není výslovně povinná.** Dokumentace Meta ji povinně vyžaduje u reklam zasahujících USA. U Evropy zmiňuje jen úvěrové reklamy („certain parts of Europe“) a země nevyjmenovává. Investice a ETF do kategorie tématicky spadají a Meta může reklamu bez vhodné kategorie zamítnout („Ads may be rejected if the advertiser does not choose an appropriate Special Ad Category“). Cenou je hrubší cílení (věk, zájmy, žádné lookalike).

## Pravidla platforem (ověřeno 2026-10-10)

| Platforma | Co platí | Zdroj |
| --- | --- | --- |
| Meta – speciální kategorie | Kategorie *Financial products and services* nahradila 14. 1. 2025 kategorii *Credit*. Povinná je pro inzerenty z USA nebo cílící na USA. Pro Kanadu a „certain parts of Europe“ platí pravidla pro úvěrové reklamy. Při deklaraci: věk 18–65+ pevně, bez volby pohlaví, poloha minimálně v poloměru 15 km od zvoleného místa (Evropa), bez vylučování lokalit a PSČ, zájmy jen ze schváleného seznamu, bez vylučování podle zájmů a bez lookalike publik | [Meta Marketing API – Special Ad Categories](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category) |
| Meta – finanční produkty a služby | Stránku zásad jsme nástrojem nenačetli (vrací jen titulek). Podle dokumentace výše a vyhledávání může Meta vyžadovat licenci v cílové zemi a ověření identity inzerenta. **Před spuštěním přečíst v prohlížeči** | [Meta Transparency Center – Financial and insurance products and services](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/financial-services/) |
| Meta – texty | Instagram feed: primární text 125 znaků, nadpis 40, poměr 4:5. Facebook feed: primární text 50–150, nadpis 27, poměr 4:5. Instagram Stories: primární text 125, 9:16, 1440 × 2560 | Meta Ads Guide: [IG feed](https://www.facebook.com/business/ads-guide/update/image/instagram-feed), [FB feed](https://www.facebook.com/business/ads-guide/update/image/facebook-feed), [IG Stories](https://www.facebook.com/business/ads-guide/update/image/instagram-story) |
| Meta – Stories | Zhruba 14 % nahoře, 35 % dole a 6 % po stranách nechat bez textu a log (překryje je profil a tlačítko) | [Meta Ads Guide – IG Stories](https://www.facebook.com/business/ads-guide/update/image/instagram-story) |
| Google Ads | Ověření finančních inzerentů platí v 24 dalších zemích EU/EHP **včetně Česka**. Žádosti přes G2 od 23. 6. 2026, vymáhání od 23. 7. 2026. Mezi kategoriemi je *Investment*. Bez ověření se reklamy na finanční služby v dané zemi nezobrazí, účet se nepozastaví. Nefinanční inzerent, který má „compelling reason“ cílit na lidi hledající finanční služby, žádá přes G2: popíše firmu a důvod cílení a zaručí se, že nebude propagovat finanční služby | [Google – nové požadavky (červen 2026)](https://support.google.com/adspolicy/answer/17127726?hl=en), [Google – Financial Services Verification, ČR](https://support.google.com/adspolicy/answer/15332527?hl=en&co=GENIE.CountryCode%3DCZ), [Google blog](https://blog.google/products/ads-commerce/eu-financial-advertiser-verification/) |

Google Ads v tomto kroku nepřipravujeme. Riziko pro spuštění zítra: náš web finanční službu nenabízí, ale cílí na lidi, kteří ji hledají, takže by nejspíš musel žádat přes G2 jako nefinanční inzerent. Schválení není hned.

Údaje z blogů třetích stran (např. „ověření finančních inzerentů na Meta ve 38 zemích“) jsme nepoužili. Nešly ověřit u Meta.

## Právní kontrola textů a vizuálů

Podle mantinelů v [`CLAUDE.md`](../CLAUDE.md). Toto není právní rada. Před spuštěním je nutná právní kontrola.

| Pravidlo | A | B |
| --- | --- | --- |
| **Každé číslo v nadpisu, popisu i vizuálu má podmínku přímo u sebe** (částka, horizont, výnos 0 %, zdroj), nikdy jen v jiném poli | ✓ nadpis začíná „2 000 Kč/měs., 20 let:“. Vizuál má podmínku hned pod číslem | ✓ bez čísel |
| Podmínka a „ne doporučení“ v prvních 125 znacích primárního textu | ✓ 123 znaků | ✓ 105 znaků |
| Žádná výzva ke koupi konkrétního nástroje (MAR/ZPKT) | ✓ | ✓ VOO jen jako otázka, proč ho nekoupíte. UCITS fond se v reklamě nejmenuje |
| Žádný slib výnosu (40/1995, 634/1992) | ✓ výpočet výslovně s výnosem 0 % | ✓ |
| Zdroj a datum čísla | ✓ ESMA (2026, data 2024) | – |
| Rizikové upozornění | ✓ „Hodnota investice může klesat“ | ✓ a měnové riziko USD/CZK |
| Žádné personalizované doporučení (MiFID II) | ✓ | ✓ |
| Netvrdíme, co není ověřené | ✓ | ✓ dostupnost konkrétního UCITS fondu v ČR (`registered_in_cz` u VUAA = null) reklama netvrdí |
| Žádné fotky, loga emitentů ani vymyšlené značky | ✓ | ✓ |
| Hero slibuje totéž co reklama | ✓ tabulka v [`a-uspora/README.md`](a-uspora/README.md) | ✓ tabulka v [`b-zvedavost/README.md`](b-zvedavost/README.md) |

Chybí: **údaje skutečného provozovatele.** Meta i spotřebitelské právo chtějí vědět, kdo inzeruje. Ukázkový projekt je nemá (README, Co chybí).

## Vizuály

HTML šablony ve stylu stránky (papír, inkoust, účtenka, Fraunces + IBM Plex). Bez fotek a log. Barvy a třídy jsou ve sdíleném [`_shared/ad.css`](_shared/ad.css), převzaté z `app/globals.css`.

```bash
npm run render-ads   # ads/*/ad.html → feed-1x1.png, feed-4x5.png, stories-9x16.png (potřebuje síť kvůli Google Fonts)
```

Formát vybírá parametr `?f=1x1|4x5|9x16`. Šablonu jde otevřít i v prohlížeči, např. `ads/a-uspora/ad.html?f=9x16`. Formát 9:16 nechává ochranné zóny Stories (14 % nahoře, 35 % dole) bez textu. Rozlišení je 1080 × 1920. Meta doporučuje 1440 × 2560, při ladění designu přepnout `deviceScaleFactor` v [`scripts/render-ads.mjs`](../scripts/render-ads.mjs).

Čísla ve vizuálech a textech hlídá `lib/ads.test.ts`. Když se změní data nebo výpočet, test spadne dřív, než reklama začne tvrdit něco jiného než hero.

## Ověření slibu A (2026-10-09)

Původní text „Na poplatcích ETF můžete za 20 let ztratit desítky tisíc Kč“ z našich dat neplatí: mezi ETF v datech (TER 0,03–0,14 %) dělá rozdíl za 20 let při 2 000 Kč měsíčně a modelovém výnosu 5 % jen asi 3 800–10 300 Kč. Platí až při srovnání průměrného ETF s průměrným aktivním akciovým fondem v EU, a to i bez výnosu:

- ESMA, *Costs and Performance of EU Retail Investment Products 2025* (3. 3. 2026, data 2024): pasivní akciové ETF 0,2 %, aktivní akciové fondy bez ETF 1,2 % průběžných nákladů ročně (`data/benchmarks.json`).
- 2 000 Kč měsíčně, 20 let, výnos 0 %: rozdíl **44 246 Kč** (zamčeno unit testem `lib/calc.test.ts`, v reklamě a hero zaokrouhleno na 44 200 Kč).

Proto nový text (sloveso „ztratit“ je nepřesné – poplatek se platí):

> Při 2 000 Kč měsíčně je rozdíl v poplatcích fondů za 20 let přes 40 000 Kč – i bez jakéhokoli výnosu. Spočítejte si to.

Podmínka „při 2 000 Kč měsíčně“ je v textu nutná. Rozdíl roste s částkou, bez ní by tvrzení neplatilo pro každého (výnos 0 %, 20 let):

| Měsíčně | Rozdíl ESMA 0,2 % vs. 1,2 % |
| --- | --- |
| 500 Kč | 11 061 Kč |
| 1 000 Kč | 22 123 Kč |
| 2 000 Kč | 44 246 Kč |

Historie: (1) „Na poplatcích ETF můžete za 20 let ztratit desítky tisíc Kč“ – mezi ETF neplatí; (2) „Rozdíl v poplatcích fondů dělá za 20 let desítky tisíc Kč, i bez jakéhokoli výnosu“ – bez podmínky výše vkladu, při 500 Kč měsíčně neplatí (odhalila lidská revize); (3) text výše; (4) v reklamě (krok 7, 2026-10-10) „i bez výnosu“ místo „i bez jakéhokoli výnosu“ a hned za tím „Modelový výpočet, ne doporučení.“, aby podmínka i upozornění byly v prvních 125 znacích (před „Zobrazit více“). Věcně se nic nemění, v hero zůstává „I bez jakéhokoli výnosu“.

Povinný disclaimer v reklamě (v reklamě A je „Modelový výpočet, ne doporučení.“ už v 1. odstavci, disclaimer pak končí „Hodnota investice může klesat.“):

> Průměrné průběžné náklady ETF (0,2 %) vs. aktivních akciových fondů v EU (1,2 %) podle ESMA (2026, data 2024), 2 000 Kč měsíčně po dobu 20 let, výnos 0 %: rozdíl 44 200 Kč. Modelový výpočet, ne doporučení.

Hero B: „A jaké alternativy jsou v ČR dostupné“ místo „který fond místo něj“ – bez výzvy ke koupi.
