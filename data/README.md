# data

Statická data o ETF v `etfs.json`. Ceny v reálném čase nepotřebujeme.

5 ETF kotovaných na NYSE Arca (SPY, VOO, IVV, VTI, VT) a k nim 5 UCITS alternativ obchodovaných na Xetře (SPYL, VUAA, SXR8, SXR4, VWCE). U UCITS bereme akumulační třídu; distribuční třídy jsou zmíněné jen v poznámce.

## Schéma záznamu

Každé pole kromě `id`, `kind` a `ucits_equivalent` má tvar:

```json
{ "value": …, "source_url": "https://…", "retrieved_at": "YYYY-MM-DD", "note": "…", "cross_check": [{ "source_url", "value", "retrieved_at", "note" }] }
```

`cross_check` jsou další nezávislé zdroje téže hodnoty (prospekt, KID, NYSE…). Do `note` se píše doslovný úryvek ze zdroje nebo důvod `null`.

| Pole | Význam |
| --- | --- |
| `id` | Krátký identifikátor (ticker na hlavní burze) |
| `kind` | `us` (NYSE ETF) / `ucits` (evropská alternativa) |
| `ticker` | Ticker fondu na uvedené burze |
| `name` | Celý název fondu |
| `issuer` | Emitent (Vanguard, iShares, SPDR…) |
| `isin` | ISIN |
| `exchange` | Burza kotace (US: NYSE Arca, UCITS: Deutsche Börse / Xetra) |
| `domicile` | Domicil fondu |
| `currency` | Měna obchodování na uvedené burze |
| `base_currency` | Měna fondu – podstatná pro měnové riziko USD/CZK |
| `ter` | Roční nákladovost v % (`0.03` = 0,03 %). US: expense ratio, UCITS: TER/OCF |
| `aum` | `{ amount, currency, as_of }` – aktiva celého fondu (všechny třídy) k datu ze zdroje |
| `distribution` | `accumulating` / `distributing` |
| `index` | Sledovaný index |
| `registered_in_cz` | `true`, pokud emitent na stránce fondu uvádí Českou republiku mezi zeměmi registrace; jinak `null` + důvod |
| `ucits_equivalent` | Jen u `us`: `{ isin, match, note, public_note }`, `match` = `same_index` (stejný index) / `closest` (nejbližší alternativa). `note` je interní poznámka (zdroje, co není ověřeno), **na stránce se zobrazuje jen `public_note`** – krátká věta pro laika bez URL a interních poznámek |

`meta.verified_by_human` = data prošla ručním ověřením podle [`docs/overeni-dat.md`](../docs/overeni-dat.md); co přesně člověk ověřil, je v `meta.verified_by_human_scope`.

## Pravidla

- **Každá hodnota má `source_url` a `retrieved_at`** (datum stažení).
- Zdroje: weby emitentů, SEC EDGAR, NYSE, KID/factsheety emitentů. OpenFIGI jen pro křížovou kontrolu ISIN. Nescrapovat Yahoo Finance; agregátory (justETF apod.) nepoužívat jako zdroj.
- Každé číslo před commitem ručně ověřit proti zdroji.
- Chybějící údaj = `null` + poznámka. Nic se nedoplňuje odhadem.

## Kontrola

```bash
node scripts/check-etfs.mjs
```

Ověří zdroj a datum u každého pole, poznámku u `null`, kontrolní číslici ISIN a že páry `same_index` mají opravdu stejný index.

## Referenční náklady (`benchmarks.json`)

Průměrné průběžné náklady akciových fondů v EU podle ESMA (pasivní ETF 0,2 %, aktivní fondy bez ETF 1,2 %; data za 2024). Kalkulačka je ukazuje jako referenční řádky, nejde o konkrétní fondy. Stejné schéma `{ value, source_url, retrieved_at, note }`, doslovná citace v `note`. Kontroluje je tentýž skript.
