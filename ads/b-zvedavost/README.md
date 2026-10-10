# Reklama B – zvědavost (Meta: Facebook, Instagram)

Texty jsou zdrojově v [`copy.json`](copy.json). Tady jsou stejné. Shodu hlídá `lib/ads.test.ts`.

## Texty

| Pole | Text | Znaků | Doporučení Meta |
| --- | --- | --- | --- |
| Primární text, 1. odstavec (vidět před „Zobrazit více“) | Proč si v Česku nekoupíte VOO? A jaké alternativy jsou v ČR dostupné. Vzdělávací srovnání, ne doporučení. | 105 | 125 |
| Primární text, 2. odstavec | Fondům z USA chybí KID, který nařízení PRIIPs vyžaduje pro prodej drobným investorům v EU. Ukážeme fondy UCITS, které sledují stejný index jako VOO – s poplatky, zdrojem a datem dat. | | |
| Primární text, 3. odstavec (rizika) | Hodnota investice může klesat. Fondy investují v USD, kurz USD/CZK může výsledek snížit i zvýšit. | | |
| Nadpis | Proč si v Česku nekoupíte VOO? | 30 | 40 (IG feed), 27 (FB feed) |
| Popis | Srovnání ETF z NYSE a UCITS | 27 | Meta neuvádí |
| Tlačítko | Zjistit víc | | |

V reklamě není žádné číslo ani konkrétní UCITS fond. VUAA a jeho TER návštěvník uvidí až na stránce, aby reklama nepropagovala konkrétní nástroj. Feed na Facebooku může nadpis zkrátit na 27 znaků. Otázka bez čísla tím nezačne klamat.

## Cílová URL

```
https://etf-srovnani.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=etf-srovnani-cz-2026-10&utm_content=b-zvedavost
```

`utm_content` začíná `b`, a proto `proxy.ts` ukáže hero B (rewrite na `/v/b`, URL zůstává). Stránka uloží `ad_variant = b`.

## Soulad s hero B

| Tvrzení v reklamě | Kde to návštěvník uvidí v hero |
| --- | --- |
| Proč si v Česku nekoupíte VOO? | Nadpis, doslova |
| A jaké alternativy jsou v ČR dostupné | Podnadpis, doslova |
| Fondům z USA chybí KID (PRIIPs) | Věta pod podnadpisem, stejné znění |
| Fondy UCITS na stejný index jako VOO | Účtenka VOO ↔ VUAA, „Stejný index S&P 500“, TER obou z dat emitentů s datem |
| Vzdělávací srovnání, ne doporučení | Sekce srovnání („informativní, nejde o doporučení“) a důvěra s rizikovým upozorněním |

## Vizuály

| Soubor | Formát | Umístění |
| --- | --- | --- |
| `feed-1x1.png` | 1080 × 1080 | feed FB/IG |
| `feed-4x5.png` | 1080 × 1350 | feed FB/IG (Meta doporučuje 4:5) |
| `stories-9x16.png` | 1080 × 1920 | Stories, Reels |

Zdroj je [`ad.html`](ad.html). Přerenderování popisuje [`../README.md`](../README.md#vizuály).
