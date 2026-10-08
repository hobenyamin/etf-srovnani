# Chyby AI

Chyby, kterých se AI během vývoje dopustila a které byly odhaleny a opraveny. Podklad pro sekci „Práce s AI“ v README.

| Datum | Co AI udělala špatně | Jak se to zjistilo | Oprava |
| --- | --- | --- | --- |
| 2026-10-08 | Navrhl název exportu s datem 2026-10-09 (převzal ho z harmonogramu, ne ze skutečného data) | Ruční kontrola proti dnešnímu datu | Export pojmenován 2026-10-08 |
| 2026-10-08 | V plánu kroku 2 nadpis uváděl „6 US ETF“, tabulka obsahovala 5 | Odhalila AI sama při kontrole plánu (a přehlédl to i člověk při revizi plánu) | Opraveno na 5 fondů |
| 2026-10-08 | V plánu dat uvedla, že VTI sleduje „CRSP US Total Market Index“ (zastaralá znalost z tréninku). Od 29. 7. 2026 se index jmenuje Morningstar U.S. Total Market Index | Při stahování dat: web Vanguardu uváděl jiný název než plán, dohledána tisková zpráva Vanguardu | V datech název z webu + poznámka o přejmenování |
| 2026-10-08 | Při hledání stránky VUAA odhadla URL Vanguardu s portem 9679 – ten patří VWCE (FTSE All-World), slug v URL se ignoruje | AI si všimla, že titulek stránky nesedí s fondem | Port VUAA (9694) dohledán vyhledáváním; odhadnuté URL se už nepoužívají bez kontroly titulku |
| 2026-10-09 | V plánu kroku 3 účtenka ukazovala náklad aktivního fondu „−86 500 Kč“. To je ale rozdíl 0,2 % vs. 1,2 %, náklad 1,2 % proti TER 0 vychází podle vlastního vzorce na 105 200 Kč. Hero mělo ukazovat stejné číslo jako účtenka bez řádku, ze kterého by šlo dopočítat | Člověk při revizi plánu | Do účtenky přidány řádky „Průměrný ETF v EU 0,2 %“ a „Rozdíl“, hero = přesně `esmaGap` z `computeFees()`; všechna tři čísla zamčena unit testy |
| 2026-10-09 | Plán hero A stavěl číslo na modelovém výnosu 5 % a použil „až 86 500 Kč“ („až“ = nejvyšší možná hodnota, zavádějící). Hero B „co koupit místo něj“ zní jako výzva ke koupi | Člověk při revizi plánu | Hero a reklama A s výnosem 0 % (44 200 Kč), bez „až“; hero B „jaké alternativy jsou v ČR dostupné“; E2E test hlídá, že hero A neobsahuje „až“ |
| 2026-10-09 | V paletě navrhla šedou #C9C2B3 bez omezení použití – na textu by měla kontrast 1,54 : 1 | Člověk při revizi plánu | Šedá jen na linky; pro text tmavší #5E5A52 (6,0 : 1), akcent na textu ztmaven na #B03A0A (5,3 : 1) – kontrast spočítán skriptem |
| 2026-10-09 | První verze E2E testů selhala na vlastních selektorech: `getByLabel("E-mail")` chytal i checkbox „…dostávat e-mailem…“, `getByRole("alert")` i oznamovač navigace Next.js. Test pořadí funnelu běžel na variantě B, jejíž CTA vede na srovnání, takže compare_view logicky přišel před kalkulačkou | Běh testů | Přesnější selektory (role textbox, alert jen v #formular), funnel test na variantě A + zvláštní ověření ad_variant u B |
