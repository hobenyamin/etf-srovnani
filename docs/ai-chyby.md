# Chyby AI

Chyby, kterých se AI během vývoje dopustila a které byly odhaleny a opraveny. Podklad pro sekci „Práce s AI“ v README.

| Datum | Co AI udělala špatně | Jak se to zjistilo | Oprava |
| --- | --- | --- | --- |
| 2026-10-08 | Navrhl název exportu s datem 2026-10-09 (převzal ho z harmonogramu, ne ze skutečného data) | Ruční kontrola proti dnešnímu datu | Export pojmenován 2026-10-08 |
| 2026-10-08 | V plánu kroku 2 nadpis uváděl „6 US ETF“, tabulka obsahovala 5 | Odhalila AI sama při kontrole plánu (a přehlédl to i člověk při revizi plánu) | Opraveno na 5 fondů |
| 2026-10-08 | V plánu dat uvedla, že VTI sleduje „CRSP US Total Market Index“ (zastaralá znalost z tréninku). Od 29. 7. 2026 se index jmenuje Morningstar U.S. Total Market Index | Při stahování dat: web Vanguardu uváděl jiný název než plán, dohledána tisková zpráva Vanguardu | V datech název z webu + poznámka o přejmenování |
| 2026-10-08 | Při hledání stránky VUAA odhadla URL Vanguardu s portem 9679 – ten patří VWCE (FTSE All-World), slug v URL se ignoruje | AI si všimla, že titulek stránky nesedí s fondem | Port VUAA (9694) dohledán vyhledáváním; odhadnuté URL se už nepoužívají bez kontroly titulku |
