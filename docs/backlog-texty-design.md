# Backlog: texty a design

Úpravy textů a vizuálu, které řešíme až na konci projektu (14.–15. 10.). Funkce, data a právní mantinely mají přednost. Položku po vyřízení odškrtni a uveď commit.

| ✓ | Položka | Proč | Zdroj |
| --- | --- | --- | --- |
| ✓ | **Nadpis hero A musí mluvit o rozdílu.** Zněl „Kolik vás za 20 let stojí poplatky fondu?“, ale číslo pod ním (44 200 Kč) je rozdíl nákladů průměrného aktivního fondu a průměrného ETF (ESMA), ne celkové poplatky. | Nadpis a číslo si odporují. Návštěvník si může myslet, že 44 200 Kč zaplatí na poplatcích jakéhokoli fondu. | Revize 2026-10-09. Vyřízeno v kroku 7: „Kolik dělá rozdíl v poplatcích fondů za 20 let?“ |
| ☐ | **Fonty a celkový vizuál dořeší designer.** Současný směr „Výpis z účtu“ (Fraunces + IBM Plex, papírová paleta, účtenka) je funkční návrh, ne finální design. | Projekt nesmí působit jako výchozí výstup AI, rozhodnout musí člověk s okem pro design. | Revize 2026-10-09 |
| ☐ | **Projít texty s ohledem na srozumitelnost pro laika.** Například TER, UCITS, KID, PRIIPs, akumulační/distribuční, domicil, „náklad = poplatky + ušlý výnos“. | Cílová skupina „slyšela o S&P 500“, ale nerozumí poplatkům, měně a dostupnosti v ČR. | Revize 2026-10-09 |
| ☐ | **`/potvrzeni` po obnovení stránky znovu ukazuje tlačítko „Potvrdit e-mail“**, i když je adresa už potvrzená. Mate to návštěvníka i testera. Návrh: při načtení zavolat read-only kontrolu stavu tokenu (`invalid` / `expired` / `pending` / `already`), která nic nezapisuje. Skenerům odkazů tedy nevadí, potvrzuje dál jen tlačítko. Potvrzenému rovnou ukázat srovnání, neplatnému nebo prošlému hlášku. | Zbytečné klepnutí a dojem, že potvrzení „nedrželo“. | Ruční test 4b, 2026-10-09 |
| ☐ | **Hero B na 375 × 667 má rezervu jen ~3,5 px** mezi CTA a cookie lištou (po přidání věty o KID, krok 7). Při úpravě písma nebo mezer v hero B hlídá E2E test „lišta nezakryje CTA“. | Každý řádek navíc schová CTA pod lištu na menších telefonech. | E2E test, 2026-10-10 |
