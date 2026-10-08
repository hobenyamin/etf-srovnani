# ads

Dvě verze reklamy. Kampaň cílí jen na ČR.

| Složka | Varianta | Slib |
| --- | --- | --- |
| `a-uspora/` | A – úspora | Rozdíl v poplatcích fondů dělá za 20 let desítky tisíc Kč, i bez jakéhokoli výnosu. Spočítejte si to. |
| `b-zvedavost/` | B – zvědavost | Proč si v Česku nekoupíte VOO? A jaké alternativy jsou v ČR dostupné. |

## Obsah každé varianty

- vizuál 1:1 nebo 4:5 (feed) a 9:16 (stories),
- primární text, nadpis, CTA,
- návrh cílení (ČR, 25–45 let, s ohledem na omezení finančních reklam na Meta a Google),
- `utm_content` hodnota, podle které stránka ukáže odpovídající hero: začíná `a-` (např. `a-uspora-feed`) nebo `b-` (`b-zvedavost-stories`). Hodnota začínající `b` → hero B, cokoli jiného → hero A (`proxy.ts`).

## Ověření slibu A (2026-10-09)

Původní text „Na poplatcích ETF můžete za 20 let ztratit desítky tisíc Kč“ z našich dat neplatí: mezi ETF v datech (TER 0,03–0,14 %) dělá rozdíl za 20 let při 2 000 Kč měsíčně a modelovém výnosu 5 % jen asi 3 800–10 300 Kč. Platí až při srovnání průměrného ETF s průměrným aktivním akciovým fondem v EU, a to i bez výnosu:

- ESMA, *Costs and Performance of EU Retail Investment Products 2025* (3. 3. 2026, data 2024): pasivní akciové ETF 0,2 %, aktivní akciové fondy bez ETF 1,2 % průběžných nákladů ročně (`data/benchmarks.json`).
- 2 000 Kč měsíčně, 20 let, výnos 0 %: rozdíl **44 246 Kč** (zamčeno unit testem `lib/calc.test.ts`, v reklamě a hero zaokrouhleno na 44 200 Kč).

Proto nový text (sloveso „ztratit“ je nepřesné – poplatek se platí) a povinný disclaimer v reklamě:

> Průměrné průběžné náklady ETF (0,2 %) vs. aktivních akciových fondů v EU (1,2 %) podle ESMA (2026, data 2024), 2 000 Kč měsíčně po dobu 20 let, výnos 0 %: rozdíl 44 200 Kč. Modelový výpočet, ne doporučení.

Hero B: „A jaké alternativy jsou v ČR dostupné“ místo „který fond místo něj“ – bez výzvy ke koupi.
