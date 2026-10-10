Krok 8c: zklidnění barev, číslice, razítko, animace
Kontext
Designová revize kroku 8b: kobalt vedle oranžovočervené působí křiklavě, přeškrtnutá nula v datech a procentech ruší. Děkovací stav má dostat razítko a plné srovnání přepínač. Přibudou jemné animace (sticky lišta, scroll, details). Nemění se čísla, právní texty, eventy ani chování formulářů. Malé commity v češtině, bez push, po dokončení se zastavím.

1. Barvy: ztráta už není barva
app/globals.css: --color-loss a --color-keep zrušit. Přibude --color-error: #b03a0a (stejná hodnota, 5,3 : 1). Zůstane jen u validační chyby formuláře (LeadForm.tsx) a varování na /zasady. Jde o chybový stav, ne o „ztrátu“. Komentář s kontrasty upravit.
Číslo v hero A, rozdíl v účtence a náklady −X Kč (Hero.tsx, FeeReceipt.tsx) budou v ink (15,5 : 1). Důraz nese velikost a tloušťka (bold).
Pruhy v rozpisu účtenky rozliší tvar, ne barva:
průměrný aktivní fond (dražší srovnání): plný ink
ostatní řádky (levnější varianty): obrys ink 1,5 px bez výplně Netextový kontrast je 15,5 : 1.
Kobalt zůstává jediný výrazný akcent.
Reklamy (ads/_shared/ad.css, oba ad.html):
zrušit --loss/--keep
A: číslo v ink; pruhy plný ink vs. obrys
B: „bez KID“ v muted (6,0 : 1) normální tloušťkou, „s KID“ v ink bold. Bez symbolů, které by připomínaly zaškrtávátka (Meta).
přerenderovat PNG, lib/ads.test.ts musí projít
2. Číslice
Ověřeno v 8b: obyčejnou nulu dává salt, ale jen u proporcionálních číslic. Na body proto dám font-feature-settings: "salt".
Před nasazením ověřit renderem celé abecedy včetně diakritiky a interpunkce, že salt nemění nic kromě nuly (pixelové porovnání s a bez). Kdyby měnil i jiné znaky, zastavím se a ozvu.
.num = font-variant-numeric: proportional-nums (částky, procenta, data).
Nová třída .code = tabular-nums (nula tím zůstane přeškrtnutá). Bude jen u tickerů a ISIN:
ticker v hero B
hlavička karty v PairCard.tsx; buňka ISIN přes příznak code v Row
záložky PairTabs.tsx
tickery fondů v rozpisu účtenky
ticker v reklamě B (.ticker) Data a procenta jsou dnes v .num a dostanou proporcionální číslice.
Pevná šířka animovaného čísla (FeeReceipt): relative inline-block, uvnitř neviditelná výsledná hodnota (určuje šířku) a přes ni absolutně animovaná hodnota (whitespace-nowrap). Šířka se změní jednou, když se změní výsledek, ne v každém snímku. data-testid="calc-gap" zůstane na viditelném animovaném čísle, sr-only výsledná hodnota také.
3. Razítko „ODESLÁNO“
DoneBanner.tsx: SVG fajfku nahradí <span aria-hidden className="stamp">:
text ODESLÁNO, verzálky, širší prostrkání
obrys 2,5 px ve světlé barvě na tmavém bloku, dvojitá linka přes outline + outline-offset (styl účtenky)
pootočení -6deg
Nový prop stamp (výchozí „ODESLÁNO“). ConfirmEmail.tsx dá „POTVRZENO“, protože „odesláno“ by tam nesedělo.
Animace otisku: scale(1.6) a opacity 0 → lehký překmit → scale(1), 320 ms, jen motion-safe. Nadpis, focus i role="status" zůstávají.
4. Plné srovnání s přepínačem
FullComparison.tsx: místo 5 karet pod sebou PairTabs s 5 záložkami SPY/VOO/IVV/VTI/VT, výchozí VOO (stejně jako v sekci srovnání).
PairTabs dostane volitelné columns (3 nebo 5) a panelClassName. Panel v plném srovnání bude bg-card p-4 rounded-sm (karta na bílém pozadí).
Všech 5 karet zůstane v HTML (data-testid="pair" = 5), vidět je jedna. Zdroje dál ve „Zdroje a data“.
Týká se děkovacího stavu (obě místa) i /potvrzeni.
E2E: k testům „5 dvojic“ přidám kontrolu, že je 5 záložek a právě 1 panel vidět.
5. Sticky lišta: příchod a odchod (200 ms)
StickyCta.tsx: příchod přes CSS @starting-style (translateY(100%) + opacity 0 → 0) s transition 200 ms.
Odchod: malý hook usePresence(visible, 200) nechá lištu ještě 200 ms v DOM s třídou leaving. Během odchodu má lišta inert, takže se na ni nedá kliknout ani tabnout. Zobrazí poslední krok.
Při prefers-reduced-motion se odpojí hned. Testy s toHaveCount(0) čekají na odpojení, takže projdou beze změny.
6. Scroll animace sekcí
Nová klientská komponenta components/Reveal.tsx v Landing.tsx. Cíle jsou označené data-reveal: kalkulačka, srovnání, formulář, důvěra, patička. Hero ne.
Po hydrataci (jen s JS a jen bez omezení pohybu) přidá třídu reveal sekcím, které jsou celé pod viewportem. To, co je vidět hned (začátek kalkulačky), se neskrývá, takže nic nebliká.
IntersectionObserver přidá is-in jednou a přestane sledovat.
CSS: .reveal { opacity: 0; transform: translateY(12px) }, .reveal.is-in s přechodem 400 ms. Bez JS se obsah nikdy neskryje.
Animuje se jen transform a opacity, ty se do CLS nepočítají.
7. Plynulé details
V globals.css pod @media (prefers-reduced-motion: no-preference) a @supports (interpolate-size: allow-keywords):

details { interpolate-size: allow-keywords; }
details::details-content { block-size: 0; overflow: hidden; transition: block-size 200ms, content-visibility 200ms allow-discrete; }
details[open]::details-content { block-size: auto; }
Jinde (Safari, Firefox) se details otevře bez animace. OpenSourceOnJump.tsx posune na zdroj až po dokončení přechodu (220 ms, při omezeném pohybu hned), jinak by mířil do ještě sbaleného obsahu.

8. Omezení pohybu a testy
Vše výše je pod prefers-reduced-motion: no-preference.
Rozšířím stávající E2E test „omezení pohybu“: razítko bez animace, sticky lišta bez přechodu, sekce bez třídy reveal, details::details-content bez přechodu.
Nové E2E:
sekce dostanou reveal jen s JS a jen pod viewportem; bez JS (javaScriptEnabled: false) žádná nemá opacity 0
lišta má při odchodu inert
šířka čísla v účtence se během animace nemění
9. Měření, snímky, záznam
CLS a LCP stejným skriptem jako v 8b (scratchpad vitals.mjs, produkční build s TEST_ENV, pomalá síť, CPU 4×, medián z 5 běhů). Navíc průchod se scrollem na konec stránky (CLS během scroll animací a sticky lišty). Cíl: CLS 0, LCP ≤ hodnoty z 8b (696 / 708 ms).
node scripts/screens.mjs po přepíše docs/screens/po/.
Nový scripts/record-animations.mjs (server přes scripts/test-server.mjs, testovací proměnné) natočí Playwrightem recordVideo na 375 × 812 záznam docs/screens/animace.webm. Scénář:
scroll (objevení sekcí)
kalkulačka (plynulé číslo)
sticky lišta příchod/odchod
rozbalení „Jak počítáme“
odeslání (razítko; odeslání zadržené jako ve screens.mjs) GIF nedělám: systémové ffmpeg chybí a Playwrightovo umí jen webm. README odkáže na webm.
README:
sekce Vizuální systém: barvy, číslice, razítko, animace, nové kontrasty a měření
rozhodnutí 52 přepsat (vyřešeno: proporcionální + salt, tabulkové jen ticker/ISIN)
nová rozhodnutí: chybová červená zůstává; tvar místo zelené
docs/ai-chyby.md podle potřeby, /export připomenu.
Pořadí commitů
barvy (stránka)
číslice + pevná šířka čísla
razítko
plné srovnání s přepínačem
sticky animace
scroll animace + details
reklamy + PNG
měření, snímky, záznam, README
Ověření
npm run lint, npm test (včetně lib/ads.test.ts), npx playwright test (375 px, build s TEST_ENV)
vizuální kontrola PNG reklam a snímků po
CLS/LCP podle bodu 9
servery jen s TEST_ENV, nikdy s .env.local