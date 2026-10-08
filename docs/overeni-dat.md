# Ruční ověření dat ETF

Kontrola `data/etfs.json` před commitem. Data stažena **2026-10-08**.
Postup: otevři hlavní zdroj, najdi hodnotu a odškrtni ☐ → ☑. Když hodnota nesedí, napiš správnou hodnotu vedle a dej vědět – oprava jde do `docs/ai-chyby.md`.

**Stav (2026-10-09):** ☑ = ověřeno ručně člověkem v prohlížeči. Ostatní hodnoty ověřila AI ze dvou zdrojů (`cross_check` v datech) a nezávislá křížová kontrola druhou AI (kontrolní číslice všech 10 ISINů, TER VWCE a SXR4). `meta.verified_by_human: true` s rozsahem v `meta.verified_by_human_scope`.

Tipy:
- Vanguard US (advisors.vanguard.com) a nyse.com se vykreslují přes JavaScript – otevři je v prohlížeči.
- U NYSE ověř, že stránka je `ARCX:<ticker>` (= NYSE Arca).
- ISIN US fondů není na stránkách emitentů: zkontroluj CUSIP na stránce emitenta (ISIN = `US` + CUSIP + číslice) nebo ISIN zadej do [OpenFIGI](https://www.openfigi.com/search).

## 1. KRITICKÉ – burza, ISIN, TER (všech 10 fondů)

Na těchto třech polích stojí celé srovnání a kalkulačka poplatků.

### 🔴 Burza (`exchange`)

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☑ | SPY | NYSE Arca | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/884394/000119312526022316/d77353d485bpos.htm), [ověření 2: nyse.com](https://www.nyse.com/quote/ARCX:SPY) |
| ☐ | VOO | NYSE Arca | [sec.gov](https://www.sec.gov/Archives/edgar/data/36405/000003640526000183/f44783d1.htm) | [ověření 1: nyse.com](https://www.nyse.com/quote/ARCX:VOO) |
| ☐ | IVV | NYSE Arca | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/1100663/000119312526327930/d113852d497k.htm), [ověření 2: nyse.com](https://www.nyse.com/quote/ARCX:IVV) |
| ☐ | VTI | NYSE Arca | [sec.gov](https://www.sec.gov/Archives/edgar/data/36405/000003640526000197/f44849d1.htm) | [ověření 1: nyse.com](https://www.nyse.com/quote/ARCX:VTI) |
| ☐ | VT | NYSE Arca | [sec.gov](https://www.sec.gov/Archives/edgar/data/857489/000119312526077566/f44201d1.htm) | [ověření 1: nyse.com](https://www.nyse.com/quote/ARCX:VT) |
| ☐ | SPYL | Deutsche Börse (Xetra) | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | – |
| ☑ | VUAA | Deutsche Börse (Xetra) | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | – |
| ☐ | SXR8 | Deutsche Börse (Xetra) | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | Deutsche Börse (Xetra) | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | [ověření 1: live.deutsche-boerse.com](https://live.deutsche-boerse.com/etf/ishares-msci-usa-ucits-etf-usd-acc) |
| ☐ | VWCE | Deutsche Börse (Xetra) | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | – |

### 🔴 ISIN (`isin`)

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☑ | SPY | US78462F1030 | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | [ověření 1: openfigi.com](https://www.openfigi.com/search) |
| ☑ | VOO | US9229083632 | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf) | [ověření 1: openfigi.com](https://www.openfigi.com/search) |
| ☐ | IVV | US4642872000 | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | [ověření 1: openfigi.com](https://www.openfigi.com/search) |
| ☐ | VTI | US9229087690 | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) | [ověření 1: openfigi.com](https://www.openfigi.com/search) |
| ☐ | VT | US9220427424 | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf) | [ověření 1: openfigi.com](https://www.openfigi.com/search) |
| ☐ | SPYL | IE000XZSV718 | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | [ověření 1: ssga.com](https://www.ssga.com/library-content/kids?isin=IE000XZSV718&documentType=kid&country=ie&language=en_gb&ticker=spyl-gy) |
| ☑ | VUAA | IE00BFMXXD54 | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | [ověření 1: fund-docs.vanguard.com](https://fund-docs.vanguard.com/ie00bfmxxd54_priipskid_en.pdf) |
| ☐ | SXR8 | IE00B5BMR087 | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | [ověření 1: ishares.com](https://www.ishares.com/de/privatanleger/de/literature/kiid/eu-priips-ishares-core-sp-500-ucits-etf-usd-acc-ie00b5bmr087-en.pdf) |
| ☐ | SXR4 | IE00B52SFT06 | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | [ověření 1: ishares.com](https://www.ishares.com/de/privatanleger/de/literature/kiid/eu-priips-ishares-msci-usa-ucits-etf-usd-acc-ie00b52sft06-en.pdf) |
| ☐ | VWCE | IE00BK5BQT80 | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | [ověření 1: fund-docs.vanguard.com](https://fund-docs.vanguard.com/ie00bk5bqt80_priipskid_en.pdf) |

### 🔴 TER / expense ratio (`ter`)

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☑ | SPY | 0,0945 % | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/884394/000119312526022316/d77353d485bpos.htm) |
| ☐ | VOO | 0,03 % | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/36405/000003640526000183/f44783d1.htm) |
| ☐ | IVV | 0,03 % | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/1100663/000119312526327930/d113852d497k.htm) |
| ☐ | VTI | 0,03 % | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/36405/000003640526000197/f44849d1.htm) |
| ☐ | VT | 0,06 % | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/857489/000119312526077566/f44201d1.htm) |
| ☐ | SPYL | 0,03 % | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | [ověření 1: ssga.com](https://www.ssga.com/library-content/kids?isin=IE000XZSV718&documentType=kid&country=ie&language=en_gb&ticker=spyl-gy), [ověření 2: ssga.com](https://www.ssga.com/library-content/kids?isin=IE000XZSV718&documentType=kid&country=cz&language=cs&ticker=spyl-gy) |
| ☑ | VUAA | 0,07 % | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | [ověření 1: fund-docs.vanguard.com](https://fund-docs.vanguard.com/ie00bfmxxd54_priipskid_en.pdf), [ověření 2: fund-docs.vanguard.com](https://fund-docs.vanguard.com/SandP_500_UCITS_ETF_USD_Accumulating_9694_EU_INT_EN.pdf) |
| ☑ | SXR8 | 0,07 % | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | [ověření 1: ishares.com](https://www.ishares.com/de/privatanleger/de/literature/kiid/eu-priips-ishares-core-sp-500-ucits-etf-usd-acc-ie00b5bmr087-en.pdf) |
| ☐ | SXR4 | 0,03 % | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | [ověření 1: ishares.com](https://www.ishares.com/de/privatanleger/de/literature/kiid/eu-priips-ishares-msci-usa-ucits-etf-usd-acc-ie00b52sft06-en.pdf) |
| ☐ | VWCE | 0,14 % | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | [ověření 1: fund-docs.vanguard.com](https://fund-docs.vanguard.com/ie00bk5bqt80_priipskid_en.pdf), [ověření 2: fund-docs.vanguard.com](https://fund-docs.vanguard.com/FTSE_All-World_UCITS_ETF_USD_Accumulating_9679_EU_INT_EN.pdf), [ověření 3: ch.vanguard](https://www.ch.vanguard/en/private-investor/insights/we-are-lowering-fees-on-one-of-our-most-popular-etfs) |

## 2. Rozhodnutí, která potřebuju od tebe

- ☑ **VTI ↔ iShares MSCI USA (SXR4)** jako „nejbližší alternativa“ – schváleno. MSCI USA pokrývá jen velké a střední firmy (~85 % trhu podle MSCI).
- ☑ **AUM u VOO, VTI, VT** – u VOO ověřeno ručně („Total net assets $1,732.0 B“ = celý fond). VTI a VT odvozeny stejnou logikou, ručně neověřeny.
- ☑ **Index VTI** – web uvádí Morningstar U.S. Total Market Index, prospekt (duben 2026) CRSP. Schváleno: název z webu Vanguardu + poznámka o přejmenování.

## 3. AUM (velikost fondu)

### AUM (`aum`)

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☑ | SPY | 821,54 mld. USD k 2026-10-07 | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | – |
| ☑ | VOO | 1732,02 mld. USD k 2026-09-30 | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf) | – |
| ☐ | IVV | 897,20 mld. USD k 2026-10-07 | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | – |
| ☐ | VTI | 2322,82 mld. USD k 2026-09-30 | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) | – |
| ☐ | VT | 101,18 mld. USD k 2026-09-30 | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf) | – |
| ☐ | SPYL | 44,95 mld. USD k 2026-10-07 | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | – |
| ☐ | VUAA | 89,23 mld. USD k 2026-08-31 | [fund-docs.vanguard.com](https://fund-docs.vanguard.com/SandP_500_UCITS_ETF_USD_Accumulating_9694_EU_INT_EN.pdf) | [ověření 1: vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) |
| ☐ | SXR8 | 161,21 mld. USD k 2026-10-07 | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | 5,24 mld. USD k 2026-10-07 | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | – |
| ☐ | VWCE | 85,32 mld. USD k 2026-08-31 | [fund-docs.vanguard.com](https://fund-docs.vanguard.com/FTSE_All-World_UCITS_ETF_USD_Accumulating_9679_EU_INT_EN.pdf) | [ověření 1: vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) |

## 4. Ostatní pole (namátkou stačí)

### `registered_in_cz` – registrace k nabízení v ČR (zatím neověřeno člověkem)

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☐ | SPY | **null** | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | – |
| ☐ | VOO | **null** | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf) | – |
| ☐ | IVV | **null** | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | – |
| ☐ | VTI | **null** | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) | – |
| ☐ | VT | **null** | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf) | – |
| ☐ | SPYL | ano | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | [ověření 1: ssga.com](https://www.ssga.com/library-content/kids?isin=IE000XZSV718&documentType=kid&country=cz&language=cs&ticker=spyl-gy) |
| ☐ | VUAA | **null** | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | – |
| ☐ | SXR8 | ano | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | ano | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | – |
| ☐ | VWCE | **null** | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | – |

### `ticker`

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☐ | SPY | SPY | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | – |
| ☐ | VOO | VOO | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf) | – |
| ☐ | IVV | IVV | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | – |
| ☐ | VTI | VTI | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) | – |
| ☐ | VT | VT | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf) | – |
| ☐ | SPYL | SPYL | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | – |
| ☐ | VUAA | VUAA | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | – |
| ☐ | SXR8 | SXR8 | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | SXR4 | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | – |
| ☐ | VWCE | VWCE | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | – |

### `name`

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☐ | SPY | State Street SPDR S&P 500 ETF Trust | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | – |
| ☐ | VOO | Vanguard S&P 500 ETF | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf) | – |
| ☐ | IVV | iShares Core S&P 500 ETF | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | – |
| ☐ | VTI | Vanguard Morningstar Total Stock Market ETF | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) | [ověření 1: corporate.vanguard.com](https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/pressroom/press-release-vanguard-to-update-names-of-us-equity-index-funds-tracking-morningstar-indexes-042926.html) |
| ☐ | VT | Vanguard Total World Stock ETF | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf) | – |
| ☐ | SPYL | State Street SPDR S&P 500 UCITS ETF (Acc) | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | – |
| ☐ | VUAA | Vanguard S&P 500 UCITS ETF (USD) Accumulating | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | – |
| ☐ | SXR8 | iShares Core S&P 500 UCITS ETF (Acc) | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | iShares MSCI USA UCITS ETF (Acc) | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | – |
| ☐ | VWCE | Vanguard FTSE All-World UCITS ETF (USD) Accumulating | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | – |

### `distribution`

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☐ | SPY | distributing | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/884394/000119312526022316/d77353d485bpos.htm) |
| ☐ | VOO | distributing | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf) | – |
| ☐ | IVV | distributing | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | – |
| ☐ | VTI | distributing | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) | – |
| ☐ | VT | distributing | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf) | – |
| ☐ | SPYL | accumulating | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | – |
| ☐ | VUAA | accumulating | [fund-docs.vanguard.com](https://fund-docs.vanguard.com/ie00bfmxxd54_priipskid_en.pdf) | – |
| ☐ | SXR8 | accumulating | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | accumulating | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | – |
| ☐ | VWCE | accumulating | [fund-docs.vanguard.com](https://fund-docs.vanguard.com/ie00bk5bqt80_priipskid_en.pdf) | – |

### `index`

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☐ | SPY | S&P 500 | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | – |
| ☐ | VOO | S&P 500 | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf) | – |
| ☐ | IVV | S&P 500 | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | – |
| ☐ | VTI | Morningstar U.S. Total Market Index | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/36405/000003640526000197/f44849d1.htm), [ověření 2: corporate.vanguard.com](https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/pressroom/press-release-vanguard-to-update-names-of-us-equity-index-funds-tracking-morningstar-indexes-042926.html) |
| ☐ | VT | FTSE Global All Cap Index | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf) | [ověření 1: sec.gov](https://www.sec.gov/Archives/edgar/data/857489/000119312526077566/f44201d1.htm) |
| ☐ | SPYL | S&P 500 | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | – |
| ☐ | VUAA | S&P 500 | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | – |
| ☐ | SXR8 | S&P 500 | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | MSCI USA | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | – |
| ☐ | VWCE | FTSE All-World Index | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | – |

### `currency`

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☐ | SPY | USD | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | – |
| ☐ | VOO | USD | [nyse.com](https://www.nyse.com/quote/ARCX:VOO) | – |
| ☐ | IVV | USD | [nyse.com](https://www.nyse.com/quote/ARCX:IVV) | – |
| ☐ | VTI | USD | [nyse.com](https://www.nyse.com/quote/ARCX:VTI) | – |
| ☐ | VT | USD | [nyse.com](https://www.nyse.com/quote/ARCX:VT) | – |
| ☐ | SPYL | EUR | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | – |
| ☐ | VUAA | EUR | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | – |
| ☐ | SXR8 | EUR | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | EUR | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | – |
| ☐ | VWCE | EUR | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | – |

### `base_currency`

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☑ | SPY | USD | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | – |
| ☐ | VOO | USD | [sec.gov](https://www.sec.gov/Archives/edgar/data/36405/000003640526000183/f44783d1.htm) | – |
| ☐ | IVV | USD | [sec.gov](https://www.sec.gov/Archives/edgar/data/1100663/000119312526327930/d113852d497k.htm) | – |
| ☐ | VTI | USD | [sec.gov](https://www.sec.gov/Archives/edgar/data/36405/000003640526000197/f44849d1.htm) | – |
| ☐ | VT | USD | [sec.gov](https://www.sec.gov/Archives/edgar/data/857489/000119312526077566/f44201d1.htm) | – |
| ☐ | SPYL | USD | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | – |
| ☐ | VUAA | USD | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | – |
| ☐ | SXR8 | USD | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | USD | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | – |
| ☐ | VWCE | USD | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | – |

### `domicile`

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☐ | SPY | USA | [sec.gov](https://www.sec.gov/Archives/edgar/data/884394/000119312526022316/d77353d485bpos.htm) | – |
| ☐ | VOO | USA | [sec.gov](https://www.sec.gov/Archives/edgar/data/36405/000003640526000183/f44783d1.htm) | – |
| ☐ | IVV | USA | [sec.gov](https://www.sec.gov/Archives/edgar/data/1100663/000119312526327930/d113852d497k.htm) | – |
| ☐ | VTI | USA | [sec.gov](https://www.sec.gov/Archives/edgar/data/36405/000003640526000197/f44849d1.htm) | – |
| ☐ | VT | USA | [sec.gov](https://www.sec.gov/Archives/edgar/data/857489/000119312526077566/f44201d1.htm) | – |
| ☐ | SPYL | Irsko | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | [ověření 1: ssga.com](https://www.ssga.com/library-content/kids?isin=IE000XZSV718&documentType=kid&country=ie&language=en_gb&ticker=spyl-gy) |
| ☐ | VUAA | Irsko | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | [ověření 1: fund-docs.vanguard.com](https://fund-docs.vanguard.com/ie00bfmxxd54_priipskid_en.pdf) |
| ☐ | SXR8 | Irsko | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | [ověření 1: ishares.com](https://www.ishares.com/de/privatanleger/de/literature/kiid/eu-priips-ishares-core-sp-500-ucits-etf-usd-acc-ie00b5bmr087-en.pdf) |
| ☐ | SXR4 | Irsko | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | [ověření 1: ishares.com](https://www.ishares.com/de/privatanleger/de/literature/kiid/eu-priips-ishares-msci-usa-ucits-etf-usd-acc-ie00b52sft06-en.pdf) |
| ☐ | VWCE | Irsko | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | [ověření 1: fund-docs.vanguard.com](https://fund-docs.vanguard.com/ie00bk5bqt80_priipskid_en.pdf) |

### `issuer`

| ✓ | Fond | Hodnota | Hlavní zdroj | Další zdroje |
| --- | --- | --- | --- | --- |
| ☐ | SPY | State Street Global Advisors (SPDR) | [ssga.com](https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy) | – |
| ☐ | VOO | Vanguard | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/voo/vanguard-sp-500-etf) | – |
| ☐ | IVV | iShares (BlackRock) | [ishares.com](https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf) | – |
| ☐ | VTI | Vanguard | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vti/vanguard-total-stock-market-etf) | – |
| ☐ | VT | Vanguard | [advisors.vanguard.com](https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf) | – |
| ☐ | SPYL | State Street Global Advisors (SPDR) | [ssga.com](https://www.ssga.com/ie/en_gb/institutional/etfs/spdr-sp-500-ucits-etf-acc-spyl-gy) | – |
| ☐ | VUAA | Vanguard | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9694/sp-500-ucits-etf-usd-accumulating) | – |
| ☐ | SXR8 | iShares (BlackRock) | [ishares.com](https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-b-ucits-etf-acc-fund) | – |
| ☐ | SXR4 | iShares (BlackRock) | [ishares.com](https://www.ishares.com/uk/individual/en/products/253740/ishares-msci-usa-b-ucits-etf) | – |
| ☐ | VWCE | Vanguard | [vanguard.co.uk](https://www.vanguard.co.uk/professional/product/etf/equity/9679/ftse-all-world-ucits-etf-usd-accumulating) | – |

## 3. Referenční náklady ESMA (`data/benchmarks.json`)

Pro kalkulačku poplatků a tvrzení reklamy A. Staženo **2026-10-09**. Ověřeno ručně v PDF 2026-10-09: citace na straně 21 sedí.

| ✓ | Hodnota | Zdroj | Co ověřit |
| --- | --- | --- | --- |
| ☑ | Průměrný pasivní akciový ETF v EU: 0,2 % | [ESMA, Costs and Performance of EU Retail Investment Products 2025](https://www.esma.europa.eu/sites/default/files/2026-03/ESMA50-1949966494-4065_Market_Report_-_Costs_and_Performance_of_EU_Retail_Investment_Products.pdf) | Úryvek „active equity ETFs have higher ongoing costs (0.3%) than passive equity ETFs (0.2%)…“, strana 21 |
| ☑ | Průměrný aktivní akciový fond v EU (bez ETF): 1,2 % | tamtéž | „… far below active equity funds excluding ETFs (1.2%)“, data za rok 2024, horizont 1 rok |
