# data

Statická data o ETF v `etfs.json`. Ceny v reálném čase nepotřebujeme.

## Schéma záznamu

| Pole | Význam |
| --- | --- |
| `ticker` | Ticker fondu |
| `name` | Celý název fondu |
| `issuer` | Emitent (Vanguard, iShares, SPDR…) |
| `isin` | ISIN |
| `exchange` | Burza kotace (u US fondů ověřit NYSE / NYSE Arca u emitenta) |
| `domicile` | Domicil fondu |
| `currency` | Měna obchodování |
| `ter` | Celková nákladovost (TER) |
| `aum` | Velikost fondu |
| `distribution` | Akumulační / distribuční |
| `ucits_equivalent` | Odkaz na evropskou UCITS alternativu |

## Pravidla

- **Každá hodnota má `source_url` a `retrieved_at`** (datum stažení).
- Zdroje: weby emitentů, SEC EDGAR, NYSE. Nescrapovat Yahoo Finance.
- Každé číslo před commitem ručně ověřit proti zdroji.
- Chybějící údaj = `null` + poznámka. Nic se nedoplňuje odhadem.
