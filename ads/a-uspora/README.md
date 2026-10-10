# Reklama A – úspora (Meta: Facebook, Instagram)

Texty jsou zdrojově v [`copy.json`](copy.json). Tady jsou stejné. Shodu hlídá `lib/ads.test.ts`.

## Texty

| Pole | Text | Znaků | Doporučení Meta |
| --- | --- | --- | --- |
| Primární text, 1. odstavec (vidět před „Zobrazit více“) | Při 2 000 Kč měsíčně je rozdíl v poplatcích fondů za 20 let přes 40 000 Kč – i bez výnosu. Modelový výpočet, ne doporučení. | 123 | 125 |
| Primární text, 2. odstavec | Spočítejte si to pro svou částku – výsledek v Kč, bez registrace. | | |
| Primární text, 3. odstavec (disclaimer) | Průměrné průběžné náklady ETF (0,2 %) vs. aktivních akciových fondů v EU (1,2 %) podle ESMA (2026, data 2024), 2 000 Kč měsíčně po dobu 20 let, výnos 0 %: rozdíl 44 200 Kč. Hodnota investice může klesat. | | |
| Nadpis | 2 000 Kč/měs., 20 let: rozdíl 44 200 Kč | 39 | 40 (IG feed), 27 (FB feed) |
| Popis | Kalkulačka poplatků v Kč | 24 | Meta neuvádí |
| Tlačítko | Zjistit víc | | |

Nadpis začíná podmínkou. Feed na Facebooku ho může zkrátit na 27 znaků („2 000 Kč/měs., 20 let: rozd…“), ale číslo 44 200 Kč nikdy nezůstane bez podmínky.

## Cílová URL

```
https://etf-srovnani.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf-srovnani-cz-2026-10&utm_content=a-uspora
```

`utm_content` nezačíná `b`, a proto `proxy.ts` ukáže hero A. Stránka uloží `ad_variant = a` k eventům i k leadu.

## Soulad s hero A

| Tvrzení v reklamě | Kde to návštěvník uvidí v hero |
| --- | --- |
| 44 200 Kč (v textu „přes 40 000 Kč“) | Velké číslo „44 200 Kč“, počítané živě funkcí `computeFees(HERO_INPUT)` stejně jako kalkulačka |
| Při 2 000 Kč měsíčně, 20 let | „za 20 let při 2 000 Kč měsíčně“ |
| I bez výnosu | „I bez jakéhokoli výnosu:“ |
| Rozdíl v poplatcích fondů | Nadpis „Kolik dělá rozdíl v poplatcích fondů za 20 let?“ |
| ESMA, ETF 0,2 % vs. aktivní fond 1,2 %, data 2024 | Poznámka pod číslem s odkazem na ESMA a datem stažení |
| Modelový výpočet, ne doporučení | Stejná věta v poznámce |
| Spočítejte si to | Tlačítko „Spočítat pro mě“ vede na kalkulačku |

## Vizuály

| Soubor | Formát | Umístění |
| --- | --- | --- |
| `feed-1x1.png` | 1080 × 1080 | feed FB/IG |
| `feed-4x5.png` | 1080 × 1350 | feed FB/IG (Meta doporučuje 4:5) |
| `stories-9x16.png` | 1080 × 1920 | Stories, Reels |

Zdroj je [`ad.html`](ad.html). Přerenderování popisuje [`../README.md`](../README.md#vizuály).
