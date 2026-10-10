
❯ /clear

❯ <ide_opened_file>The user opened the file
  /home/snnikol/work/etf-srovnani/.env.local in the IDE. This may or may not be
  related to the current task.</ide_opened_file>

❯ Přečti CLAUDE.md, README.md, ads/README.md a docs/backlog-texty-design.md.
  Commituj, nepushuj.

  Krok 7: reklamy a obsah README. Stránka je nasazená na
  https://etf-srovnani.vercel.app. V plan mode navrhni:

  A) Dvě verze reklamy (ads/a-uspora, ads/b-zvedavost) pro Meta
  (Facebook/Instagram), mobil:

  Pro každou: primární text, nadpis, popis, CTA tlačítko, cílová URL s UTM
  (utm_source, utm_medium, utm_campaign, utm_content odpovídající proxy.ts),
  návrh cílení (jen ČR, věk, zájmy) a rozpočet na test.
  Vizuály 1:1, 4:5 a 9:16 jako HTML šablony ve stejném vizuálním stylu jako
  stránka, vyrenderované do PNG přes Playwright (už ho máme). Žádné stockové
  fotky ani vymyšlená loga. Já jako designer vizuály na konci doladím, teď jde
  o funkční první verzi.
  Každé tvrzení v reklamě musí sedět s tím, co návštěvník uvidí v hero (číslo,
  podmínka, zdroj). Reklama A: „Při 2 000 Kč měsíčně je rozdíl v poplatcích
  fondů za 20 let přes 40 000 Kč – i bez jakéhokoli výnosu.“
  Právní kontrola textů podle CLAUDE.md (žádná výzva ke koupi, žádný slib
  výnosu, disclaimer). Ověř aktuální pravidla Meta pro reklamy na finanční
  produkty a služby v EU (speciální kategorie reklam, omezení cílení, ověření
  inzerenta) a Google Ads ověření finančních inzerentů. Uveď zdroj a datum, nic
  nevymýšlej.

  B) README:

  Zdůvodnění pořadí sekcí stránky (proč hero → kalkulačka → porovnání →
  formulář → důvěra).
  Očekávaná konverze: rozpad funnelu (proklik → interakce s kalkulačkou →
  zobrazení formuláře → lead → potvrzený lead) s odhadem pro každý krok.
  Benchmark jen s ověřeným zdrojem a datem. Kde zdroj nenajdeš, označ číslo
  jako vlastní předpoklad a zdůvodni ho. Uveď, jak se konverze bude měřit
  (Supabase pro leady podle ad_variant, PostHog pro odpady).
  Tři hypotézy pro A/B test seřazené podle očekávaného dopadu. Každá: co
  měníme, proč čekáme zlepšení, metrika, minimální velikost vzorku (spočítej,
  uveď předpoklady), jak se test technicky spustí (ad_variant / utm_content už
  máme).

  Implementaci rozděl: nejdřív A (reklamy), pak se zastav, já zkontroluji
  vizuály a texty. Potom B. Nic neimplementuj, dokud plán neschválím.

  Read 1 file, listed 2 directories (ctrl+o to expand)

● Web Search("Meta ads financial products and services special ad category
            Europe targeting restrictions 2026")
  ⎿  Did 1 search in 10s

● Web Search("Google Ads financial services verification EU EEA 2026
            non-financial advertiser form")
  ⎿  Did 1 search in 9s

● Web Search("Meta advertising standards financial and insurance products policy
            investment")
  ⎿  Did 2 searches in 9s

● Ověřuji pravidla Meta a Google přímo u zdrojů. Zatím mám jen přehledy z blogů,
  ty jako zdroj nestačí.

● Fetch(https://transparency.meta.com/en-gb/policies/ad-standards/restricted-goo
       ds-services/financial-services/)
  ⎿  Received 589.6KB (200 OK)

● Fetch(https://support.google.com/adspolicy/answer/17127726?hl=en)
  ⎿  Received 1.6MB (200 OK)

● Web Search("site:facebook.com/business/help special ad category financial
            products and services Europe targeting countries")
  ⎿  Did 1 search in 6s

● Fetch(https://developers.facebook.com/docs/marketing-api/audiences/special-ad-
       category)
  ⎿  Received 23.9KB (200 OK)

● Web Search("Google Ads financial services verification "not a financial
            services" advertiser form exemption informational")
  ⎿  Did 1 search in 8s

● Web Search("Meta financial services advertiser verification European Union
            2026 investment ads")
  ⎿  Did 1 search in 8s

● Fetch(https://support.google.com/adspolicy/answer/15332527?hl=en&co=GENIE.Coun
       tryCode%3DCZ)
  ⎿  Received 1.6MB (200 OK)

● Fetch(https://transparency.meta.com/policies/ad-standards/restricted-goods-ser
       vices/financial-services)
  ⎿  Received 590.2KB (200 OK)

● Web Search("Unbounce Conversion Benchmark Report finance landing page median
            conversion rate")
  ⎿  Did 1 search in 7s

● Fetch(https://unbounce.com/industry/finance/)
  ⎿  Received 359.7KB (200 OK)

● Web Search("WordStream Facebook ads benchmarks 2025 finance insurance
            click-through rate conversion rate cost per lead")
  ⎿  Did 1 search in 7s

● Web Search("double opt-in confirmation rate benchmark email signup percentage
            confirm")
  ⎿  Did 1 search in 7s

  Ran 2 shell commands (ctrl+o to expand)

● Mám podklady. Píšu plán: krok A (reklamy) se zastávkou na kontrolu, potom krok
  B (README).
● Updated plan
  ⎿  /plan to preview
  ⎿  Error: The user doesn't want to proceed with this tool use. The tool use
     was rejected (eg. if it was a file edit, the new_string was NOT written to
     the file). The user provided the following reason for the rejection:  Plán
     schvaluji s úpravami:

     Nadpis reklamy A nesmí stát bez podmínky (v některých umístěních se zobrazí
     bez primárního textu), např. „44 200 Kč rozdíl při 2 000 Kč měsíčně“. Do
     právního checklistu přidej pravidlo: každé číslo v nadpisu i ve vizuálu
     musí mít podmínku přímo u sebe.
     Ověř, že podmínka a „ne doporučení“ jsou u obou variant v prvních ~125
     znacích primárního textu (viditelné před „Zobrazit více“). Limit ověř v
     Meta Ads Guide se zdrojem.
     U A/B hypotézy reklama A vs. B uveď, že testuje kombinaci reklama + hero,
     ne jen kreativu.
     Texty a vizuály na konci projektu doladím jako designer. Teď jde o věcně
     správnou první verzi. Po části A se zastav. Commituj, nepushuj.

● Updated plan
  ⎿  /plan to preview

● Updated plan
  ⎿  /plan to preview

● Updated plan
  ⎿  /plan to preview

● Updated plan
  ⎿  /plan to preview

● User approved Claude's plan
  ⎿  Plan saved to:
     ~/.claude/plans/pasted-content-id-0b79-p-e-ti-claude-md-jiggly-kettle.md ·
     /plan to edit
     Krok 7: reklamy (A) → zastávka na kontrolu → README (B)

     Kontext

     Stránka běží na https://etf-srovnani.vercel.app. Zbývají odevzdávané
     výstupy: dvě reklamy v ads/ (zatím jen prázdné složky a ads/README.md s
     ověřením slibu A) a sekce README, kde je TODO (pořadí sekcí, konverze, A/B
     hypotézy, reklamy). Hodnoticí otázka zní „zítra spustit placenou reklamu?“.
     Reklama proto musí 1:1 sedět s hero a projít právními mantinely z
     CLAUDE.md i pravidly Meta a Google.

     Postup: A → stop (kontrola vizuálů a textů člověkem) → B. Commity malé a
     česky, bez push. Po každé části připomenout /export do ai-log/.

     ---

     A) Reklamy pro Meta (FB/IG, mobil)

     A0. Zjištění z ověření pravidel (stav k 2026-10-10, přesné citace dám do
     ads/README.md)

     Téma: Meta – speciální kategorie „Financial products and services“
     Co platí: Od 14. 1. 2025 nahradila kategorii „Credit“. Povinná je pro
     inzerenty
     z USA nebo cílící na USA. Pro Evropu dokumentace uvádí jen úvěrové reklamy
     („certain parts of Europe“), seznam zemí nenajdete. Při deklaraci: věk
     pevně
     18–65+, bez volby pohlaví, poloha s poloměrem aspoň 15 km, bez vylučování
     lokalit a bez PSČ, jen schválené zájmy, bez lookalike publik a bez
     vylučování
      podle zájmů
     Zdroj: Meta Marketing API – Special Ad Categories
     ────────────────────────────────────────
     Téma: Meta – zásady pro finanční produkty
     Co platí: Inzerent může potřebovat licenci v cílové zemi a ověřit identitu
     firmy nebo osoby. Zveřejňovací povinnosti podle zákona. Stránka zásad se
     přes
      WebFetch nenačetla (vrací jen titulek), ověřím ji v prohlížeči nebo to
     nechám na člověku
     Zdroj: Meta Transparency Center – Financial and insurance products and 
     services
     ────────────────────────────────────────
     Téma: Google Ads – ověření finančních inzerentů
     Co platí: Česko je v seznamu 24 zemí. Žádosti přes G2 od 23. 6. 2026,
     vymáhání
     od 23. 7. 2026. Kategorie: banking, credit, investment, brokerages… Bez
     ověření se nezobrazí reklamy na finanční služby, účet se nepozastaví.
     Nefinanční inzerent s „compelling reason“ cílit na lidi hledající finanční
     služby: žádost přes G2, zdůvodnění a záruka, že nebude propagovat finanční
     služby
     Zdroj: Google – June 2026 update, Google – Financial Services Verification,
     CZ,
     Google blog

     Blogy třetích stran (např. o „38 zemích“ u Meta) jako zdroj nepoužiju.
     Případně je uvedu jen jako „neověřeno“.

     Navrhované rozhodnutí (zapíšu jako rozhodnutí 42): Kampaň na Meta deklaruje
     speciální kategorii Financial products and services dobrovolně a
     konzervativně. Pro ČR to výslovně nařízeno není, ale téma (investice, ETF)
     do kategorie spadá a nedeklarovaná reklama může být zamítnuta. Důsledek:
     věk 25–45 z persony nejde nastavit. Cílíme 18–65+ v celé ČR a personu
     zasáhnou zájmy a kreativa. V README to bude jako vědomý kompromis. Google
     Ads v tomto kroku nepřipravujeme, jen riziko „nefinanční inzerent → G2“
     zapíšeme do README.

     A1. Soulad reklama ↔ hero (malé úpravy stránky)

     1. Nadpis hero A (backlog, 1. položka): „Kolik vás za 20 let stojí poplatky
        fondu?“ → „Kolik dělá rozdíl v poplatcích fondů za 20 let?“. Bude
        odpovídat textu reklamy i číslu 44 200 Kč. Upravím components/Hero.tsx,
        regex v e2e/landing.spec.ts:9 a odškrtnu položku v
        docs/backlog-texty-design.md.
     2. Hero B, jedna věta pod podnadpisem: reklama B vysvětluje „proč“ (chybí
        KID), hero dnes jen ukazuje VOO ↔ VUAA. Přidám krátkou větu ve stejném
        znění jako v components/Comparison.tsx:15: „Fondům z USA chybí KID,
        který nařízení PRIIPs vyžaduje pro prodej drobným investorům v EU.“
        Hlídá E2E test (hero B obsahuje „KID“).
     3. Rozhodnutí 16 (proxy) zůstává: utm_content začínající b → hero B.

     A2. Texty (ads/a-uspora/README.md, ads/b-zvedavost/README.md)

     Každá varianta má tabulku polí s počtem znaků a limity z Meta Ads Guide
     (limity ověřím a uvedu zdroj s datem):

     Viditelnost před „Zobrazit více“ (úprava po revizi): limit zkráceného
     primárního textu (~125 znaků) ověřím v Meta Ads Guide a uvedu zdroj a
     datum. U obou variant musí být v tomto úseku podmínka čísla i „ne
     doporučení“. Když se celá věta reklamy A s „ne doporučení“ do limitu
     nevejde, zkrátím ji věcně stejně (např. „i bez výnosu“). Změnu zapíšu do
     historie textu v ads/README.md. lib/ads.test.ts hlídá, že prvních N znaků
     primárního textu obsahuje „2 000 Kč“ (u A) a „ne doporučení“ (u obou).

     A – úspora
     - Primární text: „Při 2 000 Kč měsíčně je rozdíl v poplatcích fondů za 20
       let přes 40 000 Kč – i bez výnosu. Model, ne doporučení.“ (přesné znění
       podle limitu), pak „Spočítejte si to pro svou částku.“ a celý disclaimer
       z ads/README.md + „Hodnota investice může klesat.“
     - Nadpis (v některých umístěních je vidět bez primárního textu, proto s
       podmínkou): „44 200 Kč rozdíl při 2 000 Kč měsíčně“. Znaky spočítám proti
       limitu nadpisu. Když se vejde, přidám „/ 20 let“.
     - Popis: „Kalkulačka poplatků v Kč“
     - CTA: Zjistit víc (Learn more)

     B – zvědavost
     - Primární text: „Proč si v Česku nekoupíte VOO? Fondům z USA chybí KID,
       který pro prodej drobným investorům v EU vyžaduje nařízení PRIIPs.
       Podívejte se, jaké alternativy se stejným indexem jsou v ČR dostupné – s
       poplatky a zdroji dat.“ + „Vzdělávací srovnání, ne investiční doporučení.
       Hodnota investice může klesat.“
     - Nadpis: „Proč si v Česku nekoupíte VOO?“
     - Popis: „Srovnání ETF z NYSE a UCITS“
     - CTA: Zjistit víc

     Cílová URL (UTM podle lib/visit.ts a proxy.ts):
     https://etf-srovnani.vercel.app/?utm_source=meta&utm_medium=paid_social&utm
     _campaign=etf-srovnani-cz-2026-10&utm_content=a-uspora
     https://etf-srovnani.vercel.app/?utm_source=meta&utm_medium=paid_social&utm
     _campaign=etf-srovnani-cz-2026-10&utm_content=b-zvedavost
     Jedna reklama nese všechny formáty (přizpůsobení podle umístění), takže
     utm_content je jedno na variantu. Rozpad feed/stories ukáže Meta Ads
     Manager (breakdown podle umístění). Neukládáme utm_term, proto dynamické
     parametry Meta nepoužívám.

     Cílení (obě varianty stejné, aby se test týkal jen kreativy): ČR celá, věk
     18–65+ (důvod: A0), čeština, zájmy ze schváleného seznamu, např.
     investování, ETF, burza, osobní finance (dostupnost ověřit v Ads Manageru).
     Umístění Advantage+ s náhledem feed a stories. Žádná vlastní publika.

     Rozpočet na test (vlastní předpoklad, označím ho tak): 2 sady × 300 Kč
     denně × 7 dní = 4 200 Kč na variantu, 8 400 Kč celkem. CPC pro finance na
     Meta v ČR nemáme z ověřeného zdroje. WordStream 2025 (USA, Finance &
     Insurance) uvádí CPC 1,22 USD a CTR 0,98 %, jen jako horní orientační
     hranici. Spočítám, kolik prokliků to dá při několika CPC. Navíc uvedu, že
     na rozdíl v leadech to nestačí, jen na rozdíl v CTR a ceně prokliku.
     Výpočet vzorku je až v B.

     Právní kontrola textů (checklist v ads/README.md): každé číslo v nadpisu,
     popisu i ve vizuálu má podmínku přímo u sebe (částka, horizont, výnos 0 %,
     zdroj), nikdy jen v jiném poli. Bez výzvy ke koupi, bez slibu výnosu (výnos
     0 % je uvedený výslovně), zdroj a datum čísla, rizikové upozornění, „ne
     doporučení“, US fond jen jako vysvětlení, proč ho nekoupíte. U B žádný
     konkrétní UCITS ticker v reklamě (VUAA až na stránce), aby reklama
     nepropagovala konkrétní nástroj. Dostupnost VUAA v ČR (registered_in_cz =
     null) reklama netvrdí.

     A3. Vizuály (HTML → PNG)

     ads/_shared/ad.css            tokeny z app/globals.css (paper, ink, loss,
     keep…), .num, .receipt, .dotted
     ads/a-uspora/ad.html          jedna šablona, formát přes ?f=1x1|4x5|9x16
     (třída na <body>)
     ads/b-zvedavost/ad.html
     ads/*/feed-1x1.png, feed-4x5.png, stories-9x16.png   (1080×1080, 1080×1350,
     1080×1920)
     scripts/render-ads.mjs        Playwright chromium: file:// šablony,
     viewport podle formátu, document.fonts.ready, screenshot
     package.json                  "render-ads": "node scripts/render-ads.mjs"
     - Fonty Fraunces + IBM Plex Sans/Mono přes odkaz na Google Fonts v šabloně.
       Při renderu je potřeba síť, PNG se commitují.
     - A: malý štítek „Srovnání ETF z NYSE · pro investory v ČR“, otázka z
       nového nadpisu hero, velké „44 200 Kč“ v loss, pod ním „za 20 let při 2
       000 Kč měsíčně, výnos 0 %“. Účtenka se dvěma řádky: průměrný aktivní
       akciový fond v EU 1,2 % a průměrné ETF 0,2 %, zdroj ESMA (data 2024).
       Dole drobné „Modelový výpočet, ne doporučení“.
     - B: velká otázka „Proč si v Česku nekoupíte VOO?“, účtenka s řádky „VOO ·
       NYSE Arca – bez KID pro drobné investory v EU“ a „UCITS fondy na stejný
       index S&P 500 – ?“ (bez tickeru), „Vzdělávací srovnání, ne doporučení“.
     - 9:16: text mimo horní a spodní ochrannou zónu stories (hodnoty zón ověřím
       v Meta Ads Guide a uvedu zdroj).
     - Bez fotek, log a ikon emitentů.
     - Pojistka čísel: lib/ads.test.ts (Vitest, include je lib/**) načte
       ads/*/ad.html a ads/*/README.md a ověří, že obsahují
       formatKc(computeFees(HERO_INPUT, FEE_ROWS).esmaGap) a TER ESMA ve formátu
       formatPercent. Když se změní data, test spadne dřív, než reklama začne
       lhát. Stejný princip jako rozhodnutí 13.

     A4. Dokumentace a commity (A)

     - ads/README.md: přehled variant, tabulka pravidel platforem (A0) s
       citacemi a datem, právní checklist, rozhodnutí o speciální kategorii, jak
       přerenderovat.
     - README: sekce „Reklamy“ (TODO → krátký souhrn a odkaz), rozhodnutí 42, do
       „Zdrojů dat“ řádky Meta a Google s datem 2026-10-10, do „Právní
       upozornění“ upřesnit riziko Google (G2) podle zjištění.
     - docs/ai-chyby.md: pokud cestou opravím vlastní chybu.
     - Commity, například: Hero: nadpis A mluví o rozdílu, hero B vysvětluje KID
       → Reklamy: texty, UTM a cílení obou variant → Reklamy: HTML šablony a
       render do PNG → Reklamy: test shody čísel s hero → README: reklamy,
       pravidla Meta a Google.

     Ověření A: npm test, npm run build, npm run e2e (upravený test hero A a
     nový test KID v hero B), npm run render-ads a prohlédnutí všech 6 PNG (Read
     obrázku). Ruční kontrola: otevřít obě URL s UTM na produkci po deployi
     (nebo lokálně) a porovnat s reklamou.

     → STOP. Člověk zkontroluje vizuály a texty. Jde o věcně správnou první
     verzi. Finální texty a vizuál doladí designer na konci projektu. Commity
     bez push.

     ---

     B) README (až po schválení A)

     1. Struktura stránky a pořadí sekcí: hero (navazuje na slib reklamy, 1
        číslo, CTA) → kalkulačka (hodnota bez e-mailu, osobní číslo = důvod
        pokračovat) → porovnání (důkaz, že plná verze má obsah) → formulář
        (žádost až po výsledku, rozhodnutí 4) → důvěra (pro ty, kdo váhají, a
        pro rizikové upozornění) → patička. Odkazy na komponenty v
        components/Landing.tsx. Doplním i krátké „Cílová skupina“ a „Výměna
        hodnoty“, které jsou dosud TODO (z CLAUDE.md).
     2. Očekávaná konverze: funnel proklik → calc_start/calc_result → form_view
        → form_submit → lead_confirmed, odhad u každého kroku a výsledná míra
        lead/proklik a potvrzený lead/proklik, plus CPL při několika CPC.
        Benchmarky dohledám a ověřím přímo ve zdroji s datem: Unbounce
        Conversion Benchmark Report (finance, včetně podkategorie investing;
        čísla se na jejich webu liší, 3,8 % vs. 8,3 %, uvedu jen to, co ověřím v
        reportu). Pro míru potvrzení double opt-in jsem primární zdroj zatím
        nenašel (jen blogy), proto vlastní předpoklad s odůvodněním. Kroky
        uvnitř stránky = vlastní předpoklady. Měření: Supabase (leady a
        potvrzení podle ad_variant, SQL už v README), PostHog (odpady mezi
        kroky, jen se souhlasem).
     3. Tři hypotézy A/B seřazené podle dopadu, každá: změna, proč, primární
        metrika, vzorek a technické spuštění. Předběžně:
        a. Reklama A vs. B (úspora vs. zvědavost), metrika lead/proklik. Testuje
           kombinaci reklama + hero (každá reklama vede na vlastní hero), ne
           jen kreativu. Výsledek tedy neříká, jestli vyhrála reklama, nebo
           hero. Spuštění: dvě reklamy, utm_content → ad_variant.
        b. Žádost o e-mail přímo pod výsledkem kalkulačky vs. až po porovnání,
           metrika form_submit/calc_result. Spuštění: nový prefix utm_content
           (např. a2-…) nebo PostHog feature flag. U flagu upozornit, že bez
           souhlasu nefunguje, proto raději varianta přes URL/proxy.
        c. Hero A s kalkulačkou přímo v hero (bez CTA) vs. dnešní stav, metrika
           calc_start/page_view.
        - Vzorek: vzorec pro dva podíly (α = 0,05 oboustranně, síla 80 %),
          výchozí míra z odhadu funnelu, MDE relativně 20–30 %. Spočítám
          skriptem v scratchpadu, výsledné n na variantu a přepočet na prokliky,
          dny a Kč při rozpočtu z A2.
     4. Commity: README: pořadí sekcí, cílová skupina a výměna hodnoty → README:
        očekávaná konverze → README: hypotézy pro A/B test.

     Ověření B: každé číslo v README má zdroj s datem, nebo štítek „vlastní
     předpoklad“. Výpočet vzorku je v README reprodukovatelný (vzorec a vstupy).
     Odkazy v README vedou na existující soubory.

● Plán je schválený, začínám částí A. Nejdřív ověřím limity textů a ochranné
  zóny stories v Meta Ads Guide.

● Web Search("Meta Ads Guide image ad feed primary text 125 characters headline
            40 characters description 30 characters")
  ⎿  Did 1 search in 7s

● Web Search("Meta Ads Guide stories 9:16 safe zone 14% top 35% bottom text")
  ⎿  Did 1 search in 9s

● Fetch(https://www.facebook.com/business/ads-guide/update/image/facebook-feed)
  ⎿  Received 345.6KB (200 OK)

● Fetch(https://www.facebook.com/business/help/980593475366490)
  ⎿  Received 333.6KB (200 OK)

● Fetch(https://www.facebook.com/business/ads-guide/update/image/instagram-story
       )
  ⎿  Received 360.8KB (200 OK)

● Fetch(https://www.facebook.com/business/ads-guide/update/image/instagram-feed)
  ⎿  Received 342.5KB (200 OK)

  Ran 1 shell command (ctrl+o to expand)

● Teď úpravy hero a testů (A1).

  Ran 1 shell command (ctrl+o to expand)

● Update(components/Hero.tsx)
  ⎿  Added 1 line, removed 1 line
      25    return (
      26      <>
      27        <h1 className="mt-4 font-display text-[34px] leading-[38p
          x] font-semibold">
      28 -        Kolik vás za 20&nbsp;let stojí poplatky fondu?         
      28 +        Kolik dělá rozdíl v&nbsp;poplatcích fondů za 20&nbsp;le
         +t?                                                             
      29        </h1>
      30        <p className="mt-6 text-[15px] leading-6">I bez jakéhokol
          i výnosu:</p>
      31        <p className="num text-[44px] leading-[52px] font-semibol
          d text-loss" data-testid="hero-gap">

● Update(components/Hero.tsx)
  ⎿  Added 3 lines
      58          Proč si v&nbsp;Česku nekoupíte VOO?
      59        </h1>
      60        <p className="mt-3 text-[17px] leading-7">A&nbsp;jaké alt
          ernativy jsou v&nbsp;ČR dostupné.</p>
      61 +      <p className="mt-3 text-[15px] leading-6">               
      62 +        Fondům z&nbsp;USA chybí KID, který nařízení PRIIPs vyža
         +duje pro prodej drobným investorům v&nbsp;EU.                  
      63 +      </p>                                                     
      64        <dl className="receipt mt-6 bg-card px-4 text-[15px]">
      65          <div className="dotted flex items-baseline justify-betw
          een py-2">
      66            <dt>

● Update(e2e/landing.spec.ts)
  ⎿  Added 1 line, removed 1 line
       6  test("hero A: slib, číslo a CTA nad ohybem, bez e-mailu", async
           ({ page }) => {
       7    await page.goto("/?utm_source=meta&utm_content=a-uspora");
       8    const h1 = page.getByRole("heading", { level: 1 });
       9 -  await expect(h1).toHaveText(/Kolik vás za 20\s+let stojí popl
         -atky fondu\?/);                                                
       9 +  await expect(h1).toHaveText(/Kolik dělá rozdíl v\s+poplatcích
         + fondů za 20\s+let\?/);                                        
      10    await expect(h1).toBeInViewport();
      11    await expect(page.getByTestId("hero-gap")).toHaveText("44 200
           Kč");
      12    await expect(page.getByRole("link", { name: "Spočítat pro mě"
           })).toBeInViewport();

● Update(e2e/landing.spec.ts)
  ⎿  Added 2 lines
      18    await page.goto("/?utm_content=b-zvedavost");
      19    await expect(page.getByRole("heading", { level: 1 })).toHaveT
          ext(/Proč si v\s+Česku nekoupíte VOO\?/);
      20    await expect(page.getByText(/jaké alternativy jsou v\s+ČR dos
          tupné/)).toBeVisible();
      21 +  // Reklama B vysvětluje „proč“ – hero musí totéž říct hned, n
         +e až ve srovnání                                               
      22 +  await expect(page.locator("#hero")).toContainText(/chybí KID,
         + který nařízení PRIIPs vyžaduje/);                             
      23    await expect(page.getByRole("link", { name: "Ukázat srovnání"
           })).toBeInViewport();
      24    expect(new URL(page.url()).pathname).toBe("/");
      25    await expect.poll(() => page.evaluate(() => window.dataLayer?
          .[0]?.ad_variant)).toBe("b");

● Hero je upravený. Spouštím E2E testy hero. Ověří, že CTA v hero B je po
  přidané větě pořád nad ohybem.
  Searched for 1 pattern, ran 1 shell command (ctrl+o to expand)

● Bash(sed -i '7s/^| ☐ | \*\*Nadpis hero A musí mluvit o rozdílu.\*\* Teď zní/|
      ✓ | **Nadpis hero A musí mluvit o rozdílu.** Zněl/; 7s/| Revize 2026-10-09
      |$/| Revize…)
  ⎿  Updated docs/backlog-texty-design.md (+1 -1)
       4  
       5  | ✓ | Položka | Proč | Zdroj |
       6  | --- | --- | --- | --- |
       7 -| ☐ | **Nadpis hero A musí mluvit o rozdílu.** Teď zní „Kolik v
         -ás za 20 let stojí poplatky fondu?“, ale číslo pod ním (44 200 
         -Kč) je rozdíl nákladů průměrného aktivního fondu a průměrného E
         -TF (ESMA), ne celkové poplatky. | Nadpis a číslo si odporují. N
         -ávštěvník si může myslet, že 44 200 Kč zaplatí na poplatcích ja
         -kéhokoli fondu. | Revize 2026-10-09 |                          
       7 +| ✓ | **Nadpis hero A musí mluvit o rozdílu.** Zněl „Kolik vás 
         +za 20 let stojí poplatky fondu?“, ale číslo pod ním (44 200 Kč)
         + je rozdíl nákladů průměrného aktivního fondu a průměrného ETF 
         +(ESMA), ne celkové poplatky. | Nadpis a číslo si odporují. Návš
         +těvník si může myslet, že 44 200 Kč zaplatí na poplatcích jakéh
         +okoli fondu. | Revize 2026-10-09. Vyřízeno v kroku 7: „Kolik dě
         +lá rozdíl v poplatcích fondů za 20 let?“ |                     
       8  | ☐ | **Fonty a celkový vizuál dořeší designer.** Současný směr
           „Výpis z účtu“ (Fraunces + IBM Plex, papírová paleta, účtenka)
           je funkční návrh, ne finální design. | Projekt nesmí působit j
          ako výchozí výstup AI, rozhodnout musí člověk s okem pro design
          . | Revize 2026-10-09 |
       9  | ☐ | **Projít texty s ohledem na srozumitelnost pro laika.** N
          apříklad TER, UCITS, KID, PRIIPs, akumulační/distribuční, domic
          il, „náklad = poplatky + ušlý výnos“. | Cílová skupina „slyšela
           o S&P 500“, ale nerozumí poplatkům, měně a dostupnosti v ČR. |
           Revize 2026-10-09 |
      10  | ☐ | **`/potvrzeni` po obnovení stránky znovu ukazuje tlačítko
           „Potvrdit e-mail“**, i když je adresa už potvrzená. Mate to ná
          vštěvníka i testera. Návrh: při načtení zavolat read-only kontr
          olu stavu tokenu (`invalid` / `expired` / `pending` / `already`
          ), která nic nezapisuje. Skenerům odkazů tedy nevadí, potvrzuje
           dál jen tlačítko. Potvrzenému rovnou ukázat srovnání, neplatné
          mu nebo prošlému hlášku. | Zbytečné klepnutí a dojem, že potvrz
          ení „nedrželo“. | Ruční test 4b, 2026-10-09 |

● Teď texty reklam. Nejdřív spočítám znaky kandidátů proti limitům Meta.

  Ran 1 shell command (ctrl+o to expand)

● Fetch(https://www.wordstream.com/blog/facebook-ads-benchmarks-2025)
  ⎿  Received 0 bytes (403 Forbidden)

● WordStream vrací 403, takže ho nemůžu ověřit a nepoužiju ho. CPC v rozpočtu
  budou jen scénáře označené jako vlastní předpoklad. Píšu texty.

● Bash(cat > ads/a-uspora/copy.json <<'EOF'
      {…)
  ⎿  Created ads/a-uspora/copy.json (+13 -0)
       1 +{                                                              
       2 +  "variant": "a",                                              
       3 +  "name": "A – úspora",                                        
       4 +  "primary_text": [                                            
       5 +    "Při 2 000 Kč měsíčně je rozdíl v poplatcích fondů za 20 le
         +t přes 40 000 Kč – i bez výnosu. Modelový výpočet, ne doporučen
         +í.",                                                           
       6 +    "Spočítejte si to pro svou částku – výsledek v Kč, bez regi
         +strace.",                                                      
       7 +    "Průměrné průběžné náklady ETF (0,2 %) vs. aktivních akciov
         +ých fondů v EU (1,2 %) podle ESMA (2026, data 2024), 2 000 Kč m
         +ěsíčně po dobu 20 let, výnos 0 %: rozdíl 44 200 Kč. Hodnota inv
         +estice může klesat."                                           
       8 +  ],                                                           
       9 +  "headline": "2 000 Kč/měs., 20 let: rozdíl 44 200 Kč",       
      10 +  "description": "Kalkulačka poplatků v Kč",                   
      11 +  "cta": "Zjistit víc",                                        
      12 +  "url": "https://etf-srovnani.vercel.app/?utm_source=meta&utm_
         +medium=paid_social&utm_campaign=etf-srovnani-cz-2026-10&utm_con
         +tent=a-uspora"                                                 
      13 +}                                                              
  ⎿  Created ads/b-zvedavost/copy.json (+13 -0)
       1 +{                                                              
       2 +  "variant": "b",                                              
       3 +  "name": "B – zvědavost",                                     
       4 +  "primary_text": [                                            
       5 +    "Proč si v Česku nekoupíte VOO? A jaké alternativy jsou v Č
         +R dostupné. Vzdělávací srovnání, ne doporučení.",              
       6 +    "Fondům z USA chybí KID, který nařízení PRIIPs vyžaduje pro
         + prodej drobným investorům v EU. Ukážeme fondy UCITS na stejný 
         +index – s poplatky, zdrojem a datem dat.",                     
       7 +    "Hodnota investice může klesat. Fondy investují v USD, kurz
         + USD/CZK může výsledek snížit i zvýšit."                       
       8 +  ],                                                           
       9 +  "headline": "Proč si v Česku nekoupíte VOO?",                
      10 +  "description": "Srovnání ETF z NYSE a UCITS",                
      11 +  "cta": "Zjistit víc",                                        
      12 +  "url": "https://etf-srovnani.vercel.app/?utm_source=meta&utm_
         +medium=paid_social&utm_campaign=etf-srovnani-cz-2026-10&utm_con
         +tent=b-zvedavost"                                              
      13 +}                                                              

● Bash(sed -i 's/Ukážeme fondy UCITS na stejný index – s poplatky, zdrojem a
      datem dat./Ukážeme fondy UCITS, které sledují stejný index jako VOO – s
      poplatky, zdrojem…)
  ⎿  Updated ads/b-zvedavost/copy.json (+1 -1)
      3    "name": "B – zvědavost",
      4    "primary_text": [
      5      "Proč si v Česku nekoupíte VOO? A jaké alternativy jsou v ČR
          dostupné. Vzdělávací srovnání, ne doporučení.",
      6 -    "Fondům z USA chybí KID, který nařízení PRIIPs vyžaduje pro 
        -prodej drobným investorům v EU. Ukážeme fondy UCITS na stejný in
        -dex – s poplatky, zdrojem a datem dat.",                        
      6 +    "Fondům z USA chybí KID, který nařízení PRIIPs vyžaduje pro 
        +prodej drobným investorům v EU. Ukážeme fondy UCITS, které sledu
        +jí stejný index jako VOO – s poplatky, zdrojem a datem dat.",   
      7      "Hodnota investice může klesat. Fondy investují v USD, kurz 
         USD/CZK může výsledek snížit i zvýšit."
      8    ],
      9    "headline": "Proč si v Česku nekoupíte VOO?",

● Texty jsou hotové. Teď README obou variant: texty, URL a tabulka, kde každé
  tvrzení reklamy dohledáte v hero.

● Write(ads/a-uspora/README.md)
  ⎿  Wrote 46 lines to ads/a-uspora/README.md
       1 # Reklama A – úspora (Meta: Facebook, Instagram)
       3 Texty jsou zdrojově v [`copy.json`](copy.json). Tady jsou stejné
         . Shodu hlídá `lib/ads.test.ts`.
       5 ## Texty
       6
       8 | --- | --- | --- | --- |
       9 | Primární text, 1. odstavec (vidět před „Zobrazit více“) | Při
         000 Kč – i bez výnosu. Modelový výpočet, ne doporučení. | 123 |
         125 |
         – výsledek v Kč, bez registrace. | | |
     … +53 lines (ctrl+o to expand)

● Write(ads/b-zvedavost/README.md)
  ⎿  Wrote 44 lines to ads/b-zvedavost/README.md
       1 # Reklama B – zvědavost (Meta: Facebook, Instagram)
       3 Texty jsou zdrojově v [`copy.json`](copy.json). Tady jsou stejné
         . Shodu hlídá `lib/ads.test.ts`.
       5 ## Texty
       7 | Pole | Text | Znaků | Doporučení Meta |
       8 | --- | --- | --- | --- |
          si v Česku nekoupíte VOO? A jaké alternativy jsou v ČR dostupné
         . Vzdělávací srovnání, ne doporučení. | 105 | 125 |
         ízení PRIIPs vyžaduje pro prodej drobným investorům v EU. Ukážem
          zdrojem a datem dat. | | |
     … +52 lines (ctrl+o to expand)

● Teď hlavní ads/README.md: pravidla platforem se zdroji, cílení, rozpočet a
  právní checklist.

  Read 1 file, ran 1 shell command (ctrl+o to expand)

● Bash(S=/tmp/claude-1000/-home-snnikol-work-etf-srovnani/c356bdad-fe1e-450b-823
      8-425dfca9ce87/scratchpad && cat > $S/head.md <<'EOF'
      # Reklamy…)
  ⎿  Updated ads/README.md (+89 -10)
       1 -# ads                                                          
       1 +# Reklamy                                                      
       2  
       3 -Dvě verze reklamy. Kampaň cílí jen na ČR.                      
       3 +Dvě verze reklamy pro Meta (Facebook a Instagram), na mobil a j
         +en pro ČR. Jde o věcně správnou první verzi. Finální texty a vi
         +zuál doladí designer.                                          
       4  
       5 -| Složka | Varianta | Slib |                                   
       5 +| Složka | Varianta | Hero na stránce | `utm_content` |        
       6 +| --- | --- | --- | --- |                                      
       7 +| [`a-uspora/`](a-uspora/) | A – úspora: „Při 2 000 Kč měsíčně 
         +je rozdíl v poplatcích fondů za 20 let přes 40 000 Kč – i bez v
         +ýnosu.“ | A (číslo 44 200 Kč) | `a-uspora` |                   
       8 +| [`b-zvedavost/`](b-zvedavost/) | B – zvědavost: „Proč si v Če
         +sku nekoupíte VOO? A jaké alternativy jsou v ČR dostupné.“ | B 
         +(VOO ↔ UCITS) | `b-zvedavost` |                                
       9 +                                                               
      10 +Každá složka obsahuje texty ([`copy.json`](a-uspora/copy.json) 
         +a README s počtem znaků), tabulku soulad reklama ↔ hero, šablon
         +u vizuálu `ad.html` a PNG ve formátech 1:1, 4:5 a 9:16.        
      11 +                                                               
      12 +## Cílová URL a UTM                                            
      13 +                                                               
      14 +```                                                            
      15 +https://etf-srovnani.vercel.app/?utm_source=meta&utm_medium=pai
         +d_social&utm_campaign=etf-srovnani-cz-2026-10&utm_content=<a-us
         +pora|b-zvedavost>                                              
      16 +```                                                            
      17 +                                                               
      18 +- Stránka čte jen `utm_source`, `utm_medium`, `utm_campaign` a 
         +`utm_content` (`lib/visit.ts`). Hero vybírá `proxy.ts`: hodnota
         + začínající `b` → hero B, cokoli jiného → hero A.              
      19 +- Jedna reklama nese všechny tři formáty (přizpůsobení obsahu p
         +odle umístění), proto má jedno `utm_content` na variantu. Rozpa
         +d feed/stories ukáže Ads Manager (rozpis podle umístění).      
      20 +- Dynamické parametry Meta (`{{placement}}` apod.) nepoužíváme.
         + Stránka by je neuložila a do `utm_content` patří, protože podl
         +e něj se vybírá hero.                                          
      21 +                                                               
      22 +## Cílení a rozpočet (obě varianty stejně)                     
      23 +                                                               
      24 +Cílení je u obou variant stejné, takže výsledek testu ovlivní j
         +en reklama a její hero.                                        
      25 +                                                               
      26 +| Nastavení | Hodnota | Proč |                                 
      27  | --- | --- | --- |
       7 -| `a-uspora/` | A – úspora | Při 2 000 Kč měsíčně je rozdíl v p
         -oplatcích fondů za 20 let přes 40 000 Kč – i bez jakéhokoli výn
         -osu. Spočítejte si to. |                                       
       8 -| `b-zvedavost/` | B – zvědavost | Proč si v Česku nekoupíte VO
         -O? A jaké alternativy jsou v ČR dostupné. |                    
      28 +| Speciální kategorie reklam | **Financial products and service
         +s**, deklarovat | Viz rozhodnutí níže |                        
      29 +| Lokalita | Česko, celá země | Kampaň jen pro ČR (rozhodnutí 6
         +). V kategorii nejde vylučovat lokality |                      
      30 +| Věk | 18–65+ | V kategorii je věk pevný. Persona 25–45 let se
         + nedá nastavit, zasáhnou ji zájmy a kreativa |                 
      31 +| Pohlaví | vše | V kategorii nejde volit |                    
      32 +| Jazyk | čeština | |                                          
      33 +| Zájmy | např. investice, ETF, burza cenných papírů, osobní fi
         +nance | Jen ze schváleného seznamu pro kategorii. Dostupnost ko
         +nkrétních zájmů ověřit v Ads Manageru |                        
      34 +| Publika | bez vlastních a bez lookalike | Lookalike v kategor
         +ii nejsou. Vlastní publika zatím nemáme (pixel není nasazený) |
      35 +| Umístění | Advantage+ (feed, Stories, Reels), náhled každého 
         +formátu | Mobil |                                              
     … 67 more lines (ctrl+o to expand)

  Searched for 1 pattern (ctrl+o to expand)

● Bash(sed -i '115s/(3) aktuální text\./(3) text výše; (4) v reklamě (krok 7,
      2026-10-10) „i bez výnosu“ místo „i bez jakéhokoli výnosu“ a hned za tím
      „Modelový výpoče…)
  ⎿  Updated ads/README.md (+2 -2)
      112  | 1 000 Kč | 22 123 Kč |
      113  | 2 000 Kč | 44 246 Kč |
      114  
      115 -Historie: (1) „Na poplatcích ETF můžete za 20 let ztratit desí
          -tky tisíc Kč“ – mezi ETF neplatí; (2) „Rozdíl v poplatcích fon
          -dů dělá za 20 let desítky tisíc Kč, i bez jakéhokoli výnosu“ –
          - bez podmínky výše vkladu, při 500 Kč měsíčně neplatí (odhalil
          -a lidská revize); (3) aktuální text.                          
      115 +Historie: (1) „Na poplatcích ETF můžete za 20 let ztratit desí
          +tky tisíc Kč“ – mezi ETF neplatí; (2) „Rozdíl v poplatcích fon
          +dů dělá za 20 let desítky tisíc Kč, i bez jakéhokoli výnosu“ –
          + bez podmínky výše vkladu, při 500 Kč měsíčně neplatí (odhalil
          +a lidská revize); (3) text výše; (4) v reklamě (krok 7, 2026-1
          +0-10) „i bez výnosu“ místo „i bez jakéhokoli výnosu“ a hned za
          + tím „Modelový výpočet, ne doporučení.“, aby podmínka i upozor
          +nění byly v prvních 125 znacích (před „Zobrazit více“). Věcně 
          +se nic nemění, v hero zůstává „I bez jakéhokoli výnosu“.      
      116  
      117 -Povinný disclaimer v reklamě:                                 
      117 +Povinný disclaimer v reklamě (v reklamě A je „Modelový výpočet
          +, ne doporučení.“ už v 1. odstavci, disclaimer pak končí „Hodn
          +ota investice může klesat.“):                                 
      118  
      119  > Průměrné průběžné náklady ETF (0,2 %) vs. aktivních akciovýc
           h fondů v EU (1,2 %) podle ESMA (2026, data 2024), 2 000 Kč mě
           síčně po dobu 20 let, výnos 0 %: rozdíl 44 200 Kč. Modelový vý
           počet, ne doporučení.
      120  

● Texty a dokumentace reklam jsou hotové. Commituji je a pak udělám vizuály.

  Ran 1 shell command (ctrl+o to expand)

● Vizuály: sdílené CSS, dvě šablony a render skript.

● Bash(mkdir -p ads/_shared && cat > ads/_shared/ad.css <<'EOF'
      /* Vizuály reklam ve stylu stránky „Výpis z účtu“. Tokeny převzaté z
      app/globals.css – při změně palety…)
  ⎿  Created ads/_shared/ad.css (+86 -0)
       1 +/* Vizuály reklam ve stylu stránky „Výpis z účtu“. Tokeny převz
         +até z app/globals.css – při změně palety upravit obojí.        
       2 +   Plátno 1080 px na šířku, výška podle formátu (třída na <body
         +>: f-1x1, f-4x5, f-9x16). */                                   
       3 +:root {                                                        
       4 +  --paper: #f3efe6;                                            
       5 +  --card: #fbf9f4;                                             
       6 +  --ink: #16181d;                                              
       7 +  --muted: #5e5a52;                                            
       8 +  --rule: #c9c2b3;                                             
       9 +  --loss: #b03a0a;                                             
      10 +  --keep: #2f6b4f;                                             
      11 +  --display: "Fraunces", Georgia, serif;                       
      12 +  --sans: "IBM Plex Sans", system-ui, sans-serif;              
      13 +  --mono: "IBM Plex Mono", ui-monospace, monospace;            
      14 +}                                                              
      15 +                                                               
      16 +* { box-sizing: border-box; margin: 0; }                       
      17 +                                                               
      18 +html, body { width: 1080px; overflow: hidden; }                
      19 +body {                                                         
      20 +  background: var(--paper);                                    
      21 +  color: var(--ink);                                           
      22 +  font-family: var(--sans);                                    
      23 +  -webkit-font-smoothing: antialiased;                         
      24 +}                                                              
      25 +body.f-1x1 { height: 1080px; }                                 
      26 +body.f-4x5 { height: 1350px; }                                 
      27 +body.f-9x16 { height: 1920px; }                                
      28 +                                                               
      29 +/* Obsah. U 9:16 mimo ochranné zóny Stories (Meta: ~14 % nahoře
         +, 35 % dole, 6 % po stranách) */                               
      30 +.frame {                                                       
      31 +  height: 100%;                                                
      32 +  display: flex;                                               
      33 +  flex-direction: column;                                      
      34 +  padding: 72px 80px;                                          
      35 +}                                                              
      36 +.f-4x5 .frame { padding-block: 96px; }                         
      37 +.f-9x16 .frame { padding: 290px 90px 690px; }                  
      38 +                                                               
      39 +.label {                                                       
      40 +  font-size: 26px;                                             
     … 46 more lines (ctrl+o to expand)

● Bash(HEAD='<!doctype html>
      <html lang="cs">…)
  ⎿  Created ads/a-uspora/ad.html (+35 -0)
       1 +<!doctype html>                                                
       2 +<html lang="cs">                                               
       3 +<head>                                                         
       4 +<meta charset="utf-8">                                         
       5 +<link rel="preconnect" href="https://fonts.googleapis.com">    
       6 +<link rel="preconnect" href="https://fonts.gstatic.com" crossor
         +igin>                                                          
       7 +<link rel="stylesheet" href="https://fonts.googleapis.com/css2?
         +family=Fraunces:opsz,wght@9..144,600&family=IBM+Plex+Mono:wght@
         +400;600&family=IBM+Plex+Sans:wght@400;600&display=block">      
       8 +<link rel="stylesheet" href="../_shared/ad.css">               
       9 +<title>Reklama A – úspora</title>                              
      10 +<style>                                                        
      11 +  .gap { font-size: 150px; font-weight: 600; line-height: 1; co
         +lor: var(--loss); margin-top: 40px; }                          
      12 +  .cond { font-size: 32px; line-height: 1.35; margin-top: 16px;
         + }                                                             
      13 +  .receipt { margin-top: 48px; }                               
      14 +  .f-1x1 h1 { font-size: 58px; margin-top: 20px; }             
      15 +  .f-1x1 .gap { font-size: 130px; margin-top: 28px; }          
      16 +  .f-1x1 .receipt { margin-top: 32px; }                        
      17 +  .f-1x1 .row { padding-block: 10px; font-size: 28px; }        
      18 +</style>                                                       
      19 +</head>                                                        
      20 +<body>                                                         
      21 +<script>document.body.className = "f-" + (new URLSearchParams(l
         +ocation.search).get("f") || "4x5");</script>                   
      22 +<main class="frame">                                           
      23 +  <p class="label">Srovnání ETF z NYSE · pro investory v ČR</p>
      24 +  <h1>Kolik dělá rozdíl v poplatcích fondů za 20 let?</h1>     
      25 +  <p class="gap num">44&nbsp;200&nbsp;Kč</p>                   
      26 +  <p class="cond">při 2&nbsp;000&nbsp;Kč měsíčně po dobu 20&nbs
         +p;let, i&nbsp;bez jakéhokoli výnosu (0&nbsp;%)</p>             
      27 +  <div class="receipt">                                        
      28 +    <div class="row"><span>Průměrný aktivní akciový fond v&nbsp
         +;EU</span><span class="num">1,2&nbsp;% ročně</span></div>      
      29 +    <div class="row"><span>Průměrný akciový ETF v&nbsp;EU</span
         +><span class="num">0,2&nbsp;% ročně</span></div>               
      30 +  </div>                                                       
      31 +  <div class="spacer"></div>                                   
      32 +  <p class="note">Průběžné náklady podle ESMA (2026, data za ro
         +k 2024). Modelový výpočet, ne doporučení. Hodnota investice můž
         +e klesat.</p>                                                  
      33 +</main>                                                        
      34 +</body>                                                        
      35 +</html>                                                        
  ⎿  Created ads/b-zvedavost/ad.html (+42 -0)
       1 +<!doctype html>                                                
       2 +<html lang="cs">                                               
       3 +<head>                                                         
       4 +<meta charset="utf-8">                                         
       5 +<link rel="preconnect" href="https://fonts.googleapis.com">    
       6 +<link rel="preconnect" href="https://fonts.gstatic.com" crossor
         +igin>                                                          
       7 +<link rel="stylesheet" href="https://fonts.googleapis.com/css2?
         +family=Fraunces:opsz,wght@9..144,600&family=IBM+Plex+Mono:wght@
         +400;600&family=IBM+Plex+Sans:wght@400;600&display=block">      
       8 +<link rel="stylesheet" href="../_shared/ad.css">               
       9 +<title>Reklama B – zvědavost</title>                           
      10 +<style>                                                        
      11 +  h1 { font-size: 104px; line-height: 1.02; margin-top: 36px; }
      12 +  .sub { font-size: 40px; line-height: 1.3; margin-top: 28px; }
      13 +  .receipt { margin-top: 56px; }                               
      14 +  .tick { font-family: var(--mono); font-weight: 600; white-spa
         +ce: nowrap; }                                                  
      15 +  .no { color: var(--loss); }                                  
      16 +  .yes { color: var(--keep); }                                 
      17 +  .f-1x1 h1 { font-size: 88px; margin-top: 24px; }             
      18 +  .f-1x1 .sub { font-size: 34px; margin-top: 18px; }           
      19 +  .f-1x1 .receipt { margin-top: 36px; }                        
      20 +</style>                                                       
      21 +</head>                                                        
      22 +<body>                                                         
      23 +<script>document.body.className = "f-" + (new URLSearchParams(l
         +ocation.search).get("f") || "4x5");</script>                   
      24 +<main class="frame">                                           
      25 +  <p class="label">Srovnání ETF z NYSE · pro investory v ČR</p>
      26 +  <h1>Proč si v&nbsp;Česku nekoupíte VOO?</h1>                 
      27 +  <p class="sub">A&nbsp;jaké alternativy jsou v&nbsp;ČR dostupn
         +é.</p>                                                         
      28 +  <div class="receipt">                                        
      29 +    <div class="row">                                          
      30 +      <span><span class="num">VOO</span> · NYSE Arca<span class
         +="sub">fond z&nbsp;USA</span></span>                           
      31 +      <span class="tick no">bez KID</span>                     
      32 +    </div>                                                     
      33 +    <div class="row">                                          
      34 +      <span>Fondy UCITS<span class="sub">stejný index S&amp;P&n
         +bsp;500</span></span>                                          
      35 +      <span class="tick yes">s&nbsp;KID</span>                 
      36 +    </div>                                                     
      37 +  </div>                                                       
      38 +  <div class="spacer"></div>                                   
      39 +  <p class="note">KID vyžaduje nařízení PRIIPs pro prodej drobn
         +ým investorům v&nbsp;EU. Vzdělávací srovnání, ne doporučení.</p
         +>                                                              
      40 +</main>                                                        
     … 2 more lines (ctrl+o to expand)
  ⎿  Updated package.json (+2 -1)
       9      "lint": "eslint",
      10      "test": "vitest run",
      11      "e2e": "playwright test",
      12 -    "check-data": "node scripts/check-etfs.mjs"                
      12 +    "check-data": "node scripts/check-etfs.mjs",               
      13 +    "render-ads": "node scripts/render-ads.mjs"                
      14    },
      15    "dependencies": {
      16      "@supabase/supabase-js": "^2.117.3",
  ⎿  Created scripts/render-ads.mjs (+36 -0)
       1 +// Vyrenderuje vizuály reklam (ads/*/ad.html) do PNG pro Meta: 
         +feed 1:1 a 4:5, Stories 9:16.                                  
       2 +// Fonty jdou z Google Fonts, takže render potřebuje síť. Spušt
         +ění: npm run render-ads                                        
       3 +import { chromium } from "@playwright/test";                   
       4 +import { readdirSync, existsSync } from "node:fs";             
       5 +import { join, resolve } from "node:path";                     
       6 +import { pathToFileURL } from "node:url";                      
       7 +                                                               
       8 +const FORMATS = [                                              
       9 +  { f: "1x1", file: "feed-1x1.png", height: 1080 },            
      10 +  { f: "4x5", file: "feed-4x5.png", height: 1350 },            
      11 +  { f: "9x16", file: "stories-9x16.png", height: 1920 },       
      12 +];                                                             
      13 +                                                               
      14 +const adsDir = resolve("ads");                                 
      15 +const variants = readdirSync(adsDir).filter((d) => existsSync(j
         +oin(adsDir, d, "ad.html")));                                   
      16 +                                                               
      17 +const browser = await chromium.launch();                       
      18 +try {                                                          
      19 +  for (const variant of variants) {                            
      20 +    for (const { f, file, height } of FORMATS) {               
      21 +      const page = await browser.newPage({ viewport: { width: 1
         +080, height }, deviceScaleFactor: 1 });                        
      22 +      const url = `${pathToFileURL(join(adsDir, variant, "ad.ht
         +ml")).href}?f=${f}`;                                           
      23 +      await page.goto(url, { waitUntil: "networkidle" });      
      24 +      await page.evaluate(() => document.fonts.ready);         
      25 +      // Šablona nesmí přetéct plátno – jinak by se text v PNG 
         +oříznul                                                        
      26 +      const overflow = await page.evaluate(() => document.query
         +Selector("main").scrollHeight > document.body.clientHeight);   
      27 +      if (overflow) throw new Error(`${variant} ${f}: obsah pře
         +téká plátno`);                                                 
      28 +      const out = join(adsDir, variant, file);                 
      29 +      await page.screenshot({ path: out });                    
      30 +      console.log(out);                                        
      31 +      await page.close();                                      
      32 +    }                                                          
      33 +  }                                                            
      34 +} finally {                                                    
      35 +  await browser.close();                                       
      36 +}                                                              
  ⎿  … 6 more files changed
  ⎿  (timeout 3m)

● Všech 6 PNG je vyrenderovaných. Prohlížím je.

  Read 3 files (ctrl+o to expand)

● A vypadá v pořádku, jen podmínka pod číslem se láme a „(0 %)“ zůstává na
  samostatném řádku. Zkrátím ji na „rozdíl při 2 000 Kč měsíčně za 20 let, výnos
  0 %“. Teď B:

  Read 3 files (ctrl+o to expand)

● V B 1:1 je chyba: třída .sub pro podnadpis kolidovala se .sub v řádcích
  účtenky, takže se řádky zvětšily. Přejmenuji ji a opravím podmínku v A.

● Bash(sed -i 's/  \.sub { font-size: 40px/  .lead { font-size: 40px/; s/
      \.f-1x1 \.sub {/  .f-1x1 .lead {/; s/<p class="sub">/<p class="lead">/'
      ads/b-zvedavost/ad.h…)
  ⎿  Updated ads/a-uspora/ad.html (+1 -1)
      23    <p class="label">Srovnání ETF z NYSE · pro investory v ČR</p>
      24    <h1>Kolik dělá rozdíl v poplatcích fondů za 20 let?</h1>
      25    <p class="gap num">44&nbsp;200&nbsp;Kč</p>
      26 -  <p class="cond">při 2&nbsp;000&nbsp;Kč měsíčně po dobu 20&nbs
         -p;let, i&nbsp;bez jakéhokoli výnosu (0&nbsp;%)</p>             
      26 +  <p class="cond">rozdíl při 2&nbsp;000&nbsp;Kč měsíčně za 20&n
         +bsp;let, výnos 0&nbsp;%</p>                                    
      27    <div class="receipt">
      28      <div class="row"><span>Průměrný aktivní akciový fond v&nbsp
          ;EU</span><span class="num">1,2&nbsp;% ročně</span></div>
      29      <div class="row"><span>Průměrný akciový ETF v&nbsp;EU</span
          ><span class="num">0,2&nbsp;% ročně</span></div>
  ⎿  Updated ads/b-zvedavost/ad.html (+3 -3)
       9  <title>Reklama B – zvědavost</title>
      10  <style>
      11    h1 { font-size: 104px; line-height: 1.02; margin-top: 36px; }
      12 -  .sub { font-size: 40px; line-height: 1.3; margin-top: 28px; }
      12 +  .lead { font-size: 40px; line-height: 1.3; margin-top: 28px; 
         +}                                                              
      13    .receipt { margin-top: 56px; }
      14    .tick { font-family: var(--mono); font-weight: 600; white-spa
          ce: nowrap; }
      15    .no { color: var(--loss); }
      16    .yes { color: var(--keep); }
      17    .f-1x1 h1 { font-size: 88px; margin-top: 24px; }
      18 -  .f-1x1 .sub { font-size: 34px; margin-top: 18px; }           
      18 +  .f-1x1 .lead { font-size: 34px; margin-top: 18px; }          
      19    .f-1x1 .receipt { margin-top: 36px; }
      20  </style>
      21  </head>
     ...
      24  <main class="frame">
      25    <p class="label">Srovnání ETF z NYSE · pro investory v ČR</p>
      26    <h1>Proč si v&nbsp;Česku nekoupíte VOO?</h1>
      27 -  <p class="sub">A&nbsp;jaké alternativy jsou v&nbsp;ČR dostupn
         -é.</p>                                                         
      27 +  <p class="lead">A&nbsp;jaké alternativy jsou v&nbsp;ČR dostup
         +né.</p>                                                        
      28    <div class="receipt">
      29      <div class="row">
      30        <span><span class="num">VOO</span> · NYSE Arca<span class
          ="sub">fond z&nbsp;USA</span></span>
  ⎿  … 6 more files changed
  ⎿  (timeout 3m)

  Read 2 files (ctrl+o to expand)

● Oba vizuály jsou v pořádku. Commituji šablony, render skript a PNG.
  Ran 1 shell command (ctrl+o to expand)

● Teď test, který hlídá shodu čísel v reklamách s hero.

  Ran 1 shell command (ctrl+o to expand)

● Write(lib/ads.test.ts)
  ⎿  Wrote 118 lines to lib/ads.test.ts
       1 // Reklamy (ads/) musí tvrdit totéž co hero. Čísla v textech a v
         izuálech se kontrolují proti výpočtu
          test spadne dřív, než reklama začne lhát.
       3 import { readFileSync } from "node:fs";
       4 import { join } from "node:path";
       6 import { ESMA, FEE_ROWS } from "./fee-rows";
       7 import { computeFees, HERO_INPUT } from "./fees";
       8 import { formatInteger, formatKc, formatPercent } from "./format
       9
      10 type Copy = {
     … +133 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Selhání jsou v testu, ne v reklamách. formatKc a formatPercent vracejí pevné
  mezery a ty jsem v očekávaných hodnotách nesjednotil. Opravuji.

● Bash(sed -i 's/^const gap = formatKc(computeFees(HERO_INPUT,
      FEE_ROWS).esmaGap);/const gap = plain(formatKc(computeFees(HERO_INPUT,
      FEE_ROWS).esmaGap));/; s/^const m…)
  ⎿  Updated lib/ads.test.ts (+8 -7)
      27  // Mezery v HTML (&nbsp;) i z Intl (U+00A0, U+202F) sjednotit n
          a obyčejné
      28  const plain = (s: string) => s.replace(/&nbsp;/g, " ").replace(
          /[  ]/g, " ").replace(/&amp;/g, "&");
      29  
      30 -const gap = formatKc(computeFees(HERO_INPUT, FEE_ROWS).esmaGap)
         -;                                                              
      31 -const monthly = `${formatInteger(HERO_INPUT.monthly)} Kč`;     
      30 +const gap = plain(formatKc(computeFees(HERO_INPUT, FEE_ROWS).es
         +maGap));                                                       
      31 +const monthly = plain(`${formatInteger(HERO_INPUT.monthly)} Kč`
         +);                                                             
      32 +const pct = (value: number) => plain(formatPercent(value));    
      33  
      34  describe.each(["a-uspora", "b-zvedavost"])("reklama %s", (dir) 
          => {
      35    const c = copy(dir);
     ...
      67    });
      68  
      69    it("„přes 40 000 Kč“ platí pro číslo z hero", () => {
      69 -    expect(c.primary_text[0]).toContain("přes 40 000 Kč");     
      70 +    expect(plain(c.primary_text[0])).toContain("přes 40 000 Kč"
         +);                                                             
      71      expect(computeFees(HERO_INPUT, FEE_ROWS).esmaGap).toBeGreat
          erThan(40_000);
      72    });
      73  
     ...
      81    it("disclaimer má číslo i průměry ESMA jako hero", () => {
      82      const disclaimer = plain(c.primary_text.join(" "));
      83      expect(disclaimer).toContain(gap);
      83 -    expect(disclaimer).toContain(`ETF (${formatPercent(ESMA.etf
         -Ter)})`);                                                      
      84 -    expect(disclaimer).toContain(`(${formatPercent(ESMA.activeT
         -er)})`);                                                       
      84 +    expect(disclaimer).toContain(`ETF (${pct(ESMA.etfTer)})`); 
      85 +    expect(disclaimer).toContain(`(${pct(ESMA.activeTer)})`);  
      86    });
      87  
      88    it("vizuál: číslo z hero, podmínka hned pod ním, průměry ESMA
          ", () => {
      89      expect(HERO_INPUT.annualReturn).toBe(0);
      90      expect(html).toContain(gap);
      91      expect(html).toMatch(new RegExp(`${gap}</p>\\s*<p class="co
          nd">rozdíl při ${monthly} měsíčně za ${HERO_INPUT.years} let, v
          ýnos 0 %`));
      91 -    expect(html).toContain(formatPercent(ESMA.activeTer));     
      92 -    expect(html).toContain(formatPercent(ESMA.etfTer));        
      92 +    expect(html).toContain(pct(ESMA.activeTer));               
      93 +    expect(html).toContain(pct(ESMA.etfTer));                  
      94      expect(html).toContain("ESMA");
      95      expect(html).toContain("ne doporučení");
      96    });

● Všech 16 testů prošlo. Ještě ověřím, že test opravdu chytí chybu: dočasně
  změním číslo ve vizuálu a pak ho vrátím zpátky.

  Ran 1 shell command (ctrl+o to expand)

● Test chybu chytil a soubor je vrácený (ad.html bez změn). Pouštím celou sadu:
  unit testy, lint, build a E2E.

  Searched for 1 pattern, ran 2 shell commands (ctrl+o to expand)

● Bash(sed -i '61s/mt-3/mt-2/; 64s/receipt mt-6/receipt mt-5/'
      components/Hero.tsx && sed -n '61p;64p' components/Hero.tsx && npm run e2e
      2>&1 | tail -3)
  ⎿  Updated components/Hero.tsx (+2 -2)
      58          Proč si v&nbsp;Česku nekoupíte VOO?
      59        </h1>
      60        <p className="mt-3 text-[17px] leading-7">A&nbsp;jaké alt
          ernativy jsou v&nbsp;ČR dostupné.</p>
      61 -      <p className="mt-3 text-[15px] leading-6">               
      61 +      <p className="mt-2 text-[15px] leading-6">               
      62          Fondům z&nbsp;USA chybí KID, který nařízení PRIIPs vyža
          duje pro prodej drobným investorům v&nbsp;EU.
      63        </p>
      64 -      <dl className="receipt mt-6 bg-card px-4 text-[15px]">   
      64 +      <dl className="receipt mt-5 bg-card px-4 text-[15px]">   
      65          <div className="dotted flex items-baseline justify-betw
          een py-2">
      66            <dt>
      67              <span className="num font-semibold">{pair.us.ticker
          .value}</span>{" "}
  ⎿  (timeout 10m)

● Bash(cat >> docs/ai-chyby.md <<'EOF'
      | 2026-10-10 | Do hero B jsem přidala větu o KID a commitla ji po spuštění
      jen E2E testů s „hero“ v názvu. Test „lišta nezakryje…)
  ⎿  Updated docs/ai-chyby.md (+1 -0)
      21  | 2026-10-09 | E2E test měření předpokládal, že PostHog posílá 
          pole eventů, a že bude v Playwrightu měřit. Ve skutečnosti posí
          lá `{ api_key, batch }` gzipem a eventy z automatizovaného proh
          lížeče (`navigator.webdriver`, „HeadlessChrome“) zahazuje jako 
          boty | Test nedostal žádný požadavek; ladění v prohlížeči a ve 
          zdrojáku posthog-js | Test se tváří jako běžný mobilní Chrome a
           čte `batch`; skuteční návštěvníci se filtru netýkají |
      22  | 2026-10-09 | Do README jsem napsala „bez souhlasu stránka nes
          tahuje ani kód PostHogu“, aniž bych to ověřila. V `npm run dev`
           se knihovna stahuje z localhostu už před volbou (Turbopack nač
          ítá dynamické importy dopředu); v produkčním buildu tvrzení pla
          tí | Ruční test v prohlížeči (člověk), pak kontrola chunků prod
          ukčního buildu | README upřesněno (dev vs. produkce), E2E test 
          hlídá, že se knihovna v produkci stáhne až po souhlasu |
      23  | 2026-10-09 | Při porovnání chování lomítka na konci URL jsem 
          bez souhlasu schovala necommitnuté změny do `git stash`, abych 
          sestavila předchozí verzi. Ve stejném příkazu `pkill` ukončil c
          elý shell, `git stash pop` se nespustil a změny (proxy `/ingest
          `) zůstaly jen ve stashi | AI si všimla výstupu (exit 144) a hn
          ed zkontrolovala `git stash list` a `git status` | Změny vrácen
          y `git stash pop`, ověřeno, že se nic neztratilo (potvrdil i čl
          ověk). Nové pravidlo v CLAUDE.md: bez výslovného souhlasu žádné
           příkazy, které mění nebo schovávají necommitnuté změny. Na por
          ovnání verzí slouží samostatný `git worktree` |
      24 +| 2026-10-10 | Do hero B jsem přidala větu o KID a commitla ji 
         +po spuštění jen E2E testů s „hero“ v názvu. Test „lišta nezakry
         +je CTA v hero ani na 375 × 667“ je v `consent.spec.ts` a nespus
         +til se: CTA hero B se posunulo o 4,5 px pod cookie lištu | Celá
         + sada E2E před dalším commitem | Menší mezery v hero B (−8 px),
         + celá sada prošla. Rezerva je jen ~3,5 px, poznámka pro designe
         +ra v backlogu. Pravidlo: před commitem změny stránky vždy celé 
         +`npm run e2e`, ne výběr podle názvu |                          
  ⎿  Updated docs/backlog-texty-design.md (+1 -0)
       8  | ☐ | **Fonty a celkový vizuál dořeší designer.** Současný směr
           „Výpis z účtu“ (Fraunces + IBM Plex, papírová paleta, účtenka)
           je funkční návrh, ne finální design. | Projekt nesmí působit j
          ako výchozí výstup AI, rozhodnout musí člověk s okem pro design
          . | Revize 2026-10-09 |
       9  | ☐ | **Projít texty s ohledem na srozumitelnost pro laika.** N
          apříklad TER, UCITS, KID, PRIIPs, akumulační/distribuční, domic
          il, „náklad = poplatky + ušlý výnos“. | Cílová skupina „slyšela
           o S&P 500“, ale nerozumí poplatkům, měně a dostupnosti v ČR. |
           Revize 2026-10-09 |
      10  | ☐ | **`/potvrzeni` po obnovení stránky znovu ukazuje tlačítko
           „Potvrdit e-mail“**, i když je adresa už potvrzená. Mate to ná
          vštěvníka i testera. Návrh: při načtení zavolat read-only kontr
          olu stavu tokenu (`invalid` / `expired` / `pending` / `already`
          ), která nic nezapisuje. Skenerům odkazů tedy nevadí, potvrzuje
           dál jen tlačítko. Potvrzenému rovnou ukázat srovnání, neplatné
          mu nebo prošlému hlášku. | Zbytečné klepnutí a dojem, že potvrz
          ení „nedrželo“. | Ruční test 4b, 2026-10-09 |
      11 +| ☐ | **Hero B na 375 × 667 má rezervu jen ~3,5 px** mezi CTA a
         + cookie lištou (po přidání věty o KID, krok 7). Při úpravě písm
         +a nebo mezer v hero B hlídá E2E test „lišta nezakryje CTA“. | K
         +aždý řádek navíc schová CTA pod lištu na menších telefonech. | 
         +E2E test, 2026-10-10 |                                         

● Zbývá hlavní README: sekce Reklamy, rozhodnutí 42, zdroje a upřesnění rizika u
  Google.

  Read 1 file (ctrl+o to expand)

● Update(README.md)
  ⎿  Added 12 lines, removed 1 line
      66  
      67  ## Reklamy
      68  
      69 -TODO – varianty A (úspora) a B (zvědavost), napojení hero na `u
         -tm_content`. Podklady v [`ads/`](ads/).                        
      69 +Dvě reklamy pro Meta (Facebook, Instagram), každá s vlastním he
         +ro. Texty, vizuály 1:1, 4:5 a 9:16, cílení, rozpočet, pravidla 
         +platforem a právní kontrola jsou v [`ads/`](ads/README.md).    
      70  
      71 +| | A – úspora | B – zvědavost |                               
      72 +| --- | --- | --- |                                            
      73 +| Slib | Při 2 000 Kč měsíčně je rozdíl v poplatcích fondů za 2
         +0 let přes 40 000 Kč – i bez výnosu | Proč si v Česku nekoupíte
         + VOO? A jaké alternativy jsou v ČR dostupné |                  
      74 +| Hero | číslo 44 200 Kč (ESMA, výnos 0 %) → kalkulačka | VOO ↔
         + VUAA, chybějící KID → srovnání |                              
      75 +| `utm_content` | `a-uspora` | `b-zvedavost` |                 
      76 +| Vizuál | [feed 4:5](ads/a-uspora/feed-4x5.png) | [feed 4:5](a
         +ds/b-zvedavost/feed-4x5.png) |                                 
      77 +                                                               
      78 +- **Reklama říká totéž co hero.** Každé tvrzení má protějšek v 
         +hero (tabulky v [`ads/a-uspora/README.md`](ads/a-uspora/README.
         +md) a [`ads/b-zvedavost/README.md`](ads/b-zvedavost/README.md))
         +. Čísla hlídá unit test [`lib/ads.test.ts`](lib/ads.test.ts) pr
         +oti stejnému výpočtu, ze kterého je hero.                      
      79 +- **Každé číslo má podmínku hned u sebe:** v nadpisu, popisu i 
         +vizuálu, ne jen v jiném poli. Nadpis A proto začíná „2 000 Kč/m
         +ěs., 20 let:“, protože se v některých umístěních zobrazí bez pr
         +imárního textu.                                                
      80 +- **Vizuály jsou HTML šablony** ve stylu stránky, renderované d
         +o PNG Playwrightem (`npm run render-ads`). Jde o první verzi, f
         +inální vzhled doladí designer.                                 
      81 +                                                               
      82  ## Práce s AI
      83  
      84  TODO – pokyny agentům. Chyby: [`docs/ai-chyby.md`](docs/ai-chyb
          y.md), exporty konverzací: [`ai-log/`](ai-log/).

● Update(README.md)
  ⎿  Error editing file

● Update(README.md)
  ⎿  Added 3 lines
      198  41. **Serverové funkce ve Frankfurtu (`fra1`), nastavené ve [`
           vercel.json`](vercel.json).** Výchozí region nových projektů n
           a Vercelu je Washington (`iad1`). Supabase je ve Frankfurtu, t
           akže `fra1` zkracuje cestu k databázi a osobní údaje z formulá
           ře zpracovává server v EU. Region je ve `vercel.json`, ne jen 
           v dashboardu, aby byl vidět v repu a verzoval se. Route segmen
           t config `preferredRegion` je v Next.js 16 deprecated (dokumen
           tace v `node_modules/next`), proto ne v kódu. Hobby plán povol
           uje jeden region, `fra1` tedy stačí.
      199      - **Ve `fra1` běží:** Server Actions (odeslání formuláře, 
           potvrzení, kvalifikační otázka), `/api/odhlaseni` a odeslání e
           -mailu přes `after()`.
      200      - **Mimo `fra1`:** statické stránky jdou z CDN Vercelu nej
           blíž návštěvníkovi. `proxy.ts` (výběr hero podle `utm_content`
           ) Vercel nasazuje do všech regionů bez ohledu na nastavení, al
           e čte jen `utm_content` a nic neukládá. Rewrite `/ingest` do P
           ostHog EU obsluhuje CDN.
      201 +42. **Reklamy na Meta deklarují speciální kategorii *Financial
          + products and services*, i když pro ČR není výslovně povinná.*
          +* Dokumentace Meta ji povinně vyžaduje u reklam zasahujících U
          +SA. U Evropy zmiňuje jen úvěrové reklamy („certain parts of Eu
          +rope“) bez seznamu zemí. Investice a ETF do kategorie tématick
          +y spadají a reklamu bez vhodné kategorie může Meta zamítnout. 
          +Cena: věk je pevně 18–65+, takže personu 25–45 let nejde zacíl
          +it, bez lookalike publik a zájmy jen ze schváleného seznamu. P
          +ersonu zasáhnou zájmy a kreativa. Podrobně v [`ads/README.md`]
          +(ads/README.md#cílení-a-rozpočet-obě-varianty-stejně).        
      202 +43. **V reklamě B se nejmenuje žádný UCITS fond.** VUAA a jeho
          + TER návštěvník uvidí až na stránce. Reklama tak nepropaguje k
          +onkrétní nástroj a netvrdí jeho dostupnost v ČR (`registered_i
          +n_cz` u VUAA = null). Hlídá unit test.                        
      203 +44. **Text reklamy A je v prvním odstavci zkrácený:** „i bez v
          +ýnosu“ místo „i bez jakéhokoli výnosu“, aby se podmínka i „Mod
          +elový výpočet, ne doporučení“ vešly do 125 znaků. Tolik doporu
          +čuje Meta Ads Guide pro primární text a zbytek se může schovat
          + za „Zobrazit více“. Věcně se nic nemění.                     
      204  
      205  ## Co chybí a proč
      206  

● Update(README.md)
  ⎿  Added 3 lines
      246  | KID jako podmínka prodeje drobným investorům | Nařízení (EU)
            č. 1286/2014 (PRIIPs) | [eur-lex.europa.eu](https://eur-lex.e
           uropa.eu/eli/reg/2014/1286/oj) | – |
      247  | Regiony funkcí, limit Hobby = 1 region, middleware ve všech 
           regionech | Vercel Docs – Configuring regions for Vercel Funct
           ions | [vercel.com](https://vercel.com/docs/functions/configur
           ing-functions/region) | 2026-10-10 |
      248  | Hobby jen pro nekomerční užití | Vercel Docs – Fair Use Guid
           elines, Commercial usage | [vercel.com](https://vercel.com/doc
           s/limits/fair-use-guidelines#commercial-usage) | 2026-10-10 |
      249 +| Speciální kategorie reklam na Meta, omezení cílení | Meta Ma
          +rketing API – Special Ad Categories | [developers.facebook.com
          +](https://developers.facebook.com/docs/marketing-api/audiences
          +/special-ad-category) | 2026-10-10 |                          
      250 +| Délky textů a ochranné zóny reklam na Meta | Meta Ads Guide 
          +– Instagram feed, Facebook feed, Instagram Stories | [facebook
          +.com/business/ads-guide](https://www.facebook.com/business/ads
          +-guide/update/image/instagram-story) | 2026-10-10 |           
      251 +| Ověření finančních inzerentů v Google Ads (ČR) | Google Adve
          +rtising Policies Help – červen 2026 a Financial Services Verif
          +ication | [support.google.com](https://support.google.com/adsp
          +olicy/answer/17127726?hl=en), [ČR](https://support.google.com/
          +adspolicy/answer/15332527?hl=en&co=GENIE.CountryCode%3DCZ) | 2
          +026-10-10 |                                                   
      252  
      253  ## Právní upozornění
      254  

● Update(README.md)
  ⎿  Added 4 lines, removed 1 line
      254  
      255  Stránka je vzdělávací srovnání s daty, ne investiční doporučen
           í ani nabídka produktu. Tento projekt není právní rada; **před
            ostrým spuštěním je nutná právní kontrola** (PRIIPs, MAR/ZPKT
           , MiFID II, GDPR, zákony 40/1995, 634/1992, 480/2004 a 127/200
           5).
      256  
      257 -Rizika pro „spuštění zítra“ na straně reklamních platforem: Go
          -ogle Ads od roku 2026 vyžaduje v EU/EHP ověření finančních inz
          -erentů (pro nefinanční informační web formulář pro nefinanční 
          -inzerenty) a Meta omezuje možnosti cílení u finančních reklam.
          - Hosting: stránka běží na Hobby plánu Vercelu, který je jen pr
          -o nekomerční užití. Ostrá kampaň vyžaduje Pro.                
      257 +Rizika pro „spuštění zítra“ na straně reklamních platforem (ov
          +ěřeno 2026-10-10, zdroje v [`ads/README.md`](ads/README.md#pra
          +vidla-platforem-ověřeno-2026-10-10)):                         
      258 +- **Google Ads** vymáhá ověření finančních inzerentů v ČR od 2
          +3. 7. 2026 (kategorie mimo jiné *Investment*). Web, který fina
          +nční službu nenabízí, ale cílí na lidi, kteří ji hledají, žádá
          + přes G2 jako nefinanční inzerent: popíše důvod a zaručí se, ž
          +e nebude propagovat finanční služby. Schválení není okamžité. 
          +Google Ads proto v tomto projektu nepřipravujeme.             
      259 +- **Meta:** speciální kategorie *Financial products and servic
          +es* omezuje cílení (rozhodnutí 42). Zásady pro finanční produk
          +ty mohou vyžadovat licenci a ověření identity inzerenta. Strán
          +ku zásad jsme nástrojem nenačetli a **před spuštěním ji musí p
          +řečíst člověk**.                                              
      260 +- **Inzerent potřebuje skutečného provozovatele** (název, IČO,
          + sídlo). Ten ukázkovému projektu chybí. Hosting: stránka běží 
          +na Hobby plánu Vercelu, který je jen pro nekomerční užití. Ost
          +rá kampaň vyžaduje Pro.                                       
      261  
      262  ## Spuštění lokálně
      263  

  Searched for 1 pattern (ctrl+o to expand)

● Bash(sed -i '260s/ Ten ukázkovému projektu chybí. Hosting: stránka běží/ Ten
      ukázkovému projektu chybí.\n\nHosting: stránka běží/' README.md && sed -i
      '/^npm run che…)
  ⎿  Updated README.md (+6 -1)
      224  - **Region `fra1` ověřit na produkci** (rozhodnutí 41, checkli
           st produkce bod 1).
      225  - **Lhůta uložení potvrzených adres a příjemci údajů** v zásad
           ách: musí doplnit provozovatel.
      226  - **Migrace se spouští ručně** v SQL editoru Supabase (bez Sup
           abase CLI). Logika SQL funkcí byla během vývoje ověřena v PGli
           te (Postgres ve WASM): upsert, práva rolí, mazání po 30 dnech,
            opakované spuštění.
      227 +- **Zásady Meta pro finanční produkty** jsme nenačetli (stránk
          +a se nástrojem nenačte). Před spuštěním kampaně je musí přečís
          +t člověk, včetně ověření inzerenta.                           
      228 +- **Kampaň na Meta optimalizuje na prokliky, ne na leady.** Be
          +z pixelu a Conversions API (navržené, neimplementované) Meta n
          +eví, kdo odeslal formulář. Leady podle varianty počítáme v Sup
          +abase.                                                        
      229  - **Daňový tahák (W-8BEN, časový test).** Zatím neexistuje, pr
           oto ho stránka neslibuje – ani ve formuláři, ani na děkovací o
           brazovce. Vrátí se, až bude text se zdroji hotový a zkontrolov
           aný.
      230  
      231  ## Zdroje dat
     ...
      259  Rizika pro „spuštění zítra“ na straně reklamních platforem (ov
           ěřeno 2026-10-10, zdroje v [`ads/README.md`](ads/README.md#pra
           vidla-platforem-ověřeno-2026-10-10)):
      260  - **Google Ads** vymáhá ověření finančních inzerentů v ČR od 2
           3. 7. 2026 (kategorie mimo jiné *Investment*). Web, který fina
           nční službu nenabízí, ale cílí na lidi, kteří ji hledají, žádá
            přes G2 jako nefinanční inzerent: popíše důvod a zaručí se, ž
           e nebude propagovat finanční služby. Schválení není okamžité. 
           Google Ads proto v tomto projektu nepřipravujeme.
      261  - **Meta:** speciální kategorie *Financial products and servic
           es* omezuje cílení (rozhodnutí 42). Zásady pro finanční produk
           ty mohou vyžadovat licenci a ověření identity inzerenta. Strán
           ku zásad jsme nástrojem nenačetli a **před spuštěním ji musí p
           řečíst člověk**.
      260 -- **Inzerent potřebuje skutečného provozovatele** (název, IČO,
          - sídlo). Ten ukázkovému projektu chybí. Hosting: stránka běží 
          -na Hobby plánu Vercelu, který je jen pro nekomerční užití. Ost
          -rá kampaň vyžaduje Pro.                                       
      262 +- **Inzerent potřebuje skutečného provozovatele** (název, IČO,
          + sídlo). Ten ukázkovému projektu chybí.                       
      263 +                                                              
      264 +Hosting: stránka běží na Hobby plánu Vercelu, který je jen pro
          + nekomerční užití. Ostrá kampaň vyžaduje Pro.                 
      265  
      266  ## Spuštění lokálně
      267  
     ...
      271  npm run build
      272  npm test             # unit testy výpočtu (Vitest)
      273  npm run check-data   # kontrola zdrojů v data/
      274 +npm run render-ads   # vizuály reklam ads/*/ad.html → PNG (pot
          +řebuje síť kvůli fontům)                                      
      275  npx playwright install --with-deps chromium   # jednou
      276  npm run e2e          # Playwright, mobil 375 px (ostré služby 
           nevolá, viz playwright.config.ts)
      277  ```

● Odkazy na kotvy sedí s nadpisy v ads/README.md. Commituji README.

  Ran 1 shell command (ctrl+o to expand)

● Část A je hotová: 5 commitů, nic není pushnuté. Zastavuji se, abys mohl
  zkontrolovat vizuály a texty.

  Ke kontrole:
  - Vizuály: ads/a-uspora/ a ads/b-zvedavost/, u každé varianty feed-1x1.png,
    feed-4x5.png a stories-9x16.png. Šablona je vždy ad.html, v prohlížeči jde
    otevřít třeba jako ad.html?f=9x16.
  - Texty: v copy.json obou variant. README každé varianty má k textům počty
    znaků a tabulku, kde každé tvrzení reklamy dohledáte v hero.
  - Cílení, rozpočet, pravidla platforem a právní checklist: ads/README.md.

  Co se oproti plánu změnilo:
  - Hero B: pod podnadpis přibyla věta o chybějícím KID, aby hero vysvětlovalo
    totéž co reklama. Tím se ale tlačítko na displeji 375 × 667 posunulo o 4,5
    px pod cookie lištu. Zjistil to E2E test, mezery jsem zmenšil a teď
    prochází. Rezerva je jen asi 3,5 px, zapsal jsem to do backlogu pro design.
  - Moje chyba: úpravu hero jsem commitnul po spuštění jen části E2E testů,
    proto se regrese dostala do commitu 6da6d35. Je zapsaná v docs/ai-chyby.md.
  - Nadpis A: „2 000 Kč/měs., 20 let: rozdíl 44 200 Kč“ (39 znaků). Feed na
    Facebooku doporučuje nadpis do 27 znaků a delší zkrátí. Protože nadpis
    začíná podmínkou, číslo nikdy nezůstane bez ní.
  - Primární text A: místo „i bez jakéhokoli výnosu“ je „i bez výnosu“. Jen tak
    se podmínka i „Modelový výpočet, ne doporučení“ vejdou do prvních 125 znaků
    (123). Věcně se nic nemění, je to rozhodnutí 44 v README.
  - Rozpočet: 8 400 Kč za oba testy je vlastní předpoklad. Benchmark WordStream
    nešel otevřít (HTTP 403), takže ho neuvádím. Místo něj je v README tabulka,
    kolik prokliků rozpočet dá při ceně prokliku 5, 10 a 20 Kč.

  Ověřeno:
  - Unit testy 68/68, E2E 24/24, build prošel.
  - Nový test lib/ads.test.ts hlídá čísla, podmínky, limity znaků a výběr hero
    podle utm_content. Když jsem ve vizuálu dočasně změnil číslo, test spadl.

  Neověřeno:
  - Zásady Meta pro finanční produkty se mi nepodařilo načíst, přečíst je musí
    člověk. V README je to uvedené jako riziko.
  - Délky textů a ochranné zóny pro Stories mám přímo z Meta Ads Guide. Kolik
    znaků je skutečně vidět před „Zobrazit více“, Meta ale neuvádí. 125 znaků je
    jen jejich doporučená délka primárního textu, proto ji beru jako
    konzervativní hranici.

  Pozor: produkce na Vercelu zatím ukazuje starý nadpis A a hero B bez věty o
  KID. Reklamy sedí s hero až po push a novém nasazení.

  Před částí B prosím udělej /export do ai-log/.

❯ Část A schvaluji věcně. Dvě věci:

  V reklamě B je v účtence „V00 · NYSE Arca“. Ověř, jestli to nejsou nuly místo
  písmene O (grep na „V00“ v ads/). Pokud ano, oprav, přerenderuj PNG a do
  lib/ads.test.ts přidej kontrolu, že se ticker shoduje s data/etfs.json. Zapiš
  do docs/ai-chyby.md.
  Do docs/backlog-texty-design.md přidej pro reklamy: prázdná spodní třetina ve
  formátech 1:1 a 4:5, odlišný řez písma nadpisu B oproti A, nadpis reklamy A
  se ve feedu zkrátí (39 znaků vs. doporučených 27), zvážit kratší nadpis a
  podmínku ve vizuálu. Design a texty doladím na konci.

  Commituj, nepushuj.

  Searched for 1 pattern (ctrl+o to expand)

● V ads/ není „V00“ s nulami. Ověřím ještě bajty a podívám se, jak ticker vypadá
  ve výřezu PNG.

  Ran 1 shell command (ctrl+o to expand)

● V šabloně jsou písmena O. Pravděpodobná příčina: písmeno O v IBM Plex Mono je
  úzké a vypadá jako nula. Ověřím to zvětšeným výřezem.
  Read 1 file, ran 3 shell commands (ctrl+o to expand)

● Bash(sed -i 's#<span><span class="num">VOO</span> · NYSE Arca<span
      class="sub">#<span><span class="ticker" data-ticker>VOO</span> · NYSE
      Arca<span class="sub">#' ads…)
  ⎿  Updated ads/b-zvedavost/ad.html (+3 -1)
      12    .lead { font-size: 40px; line-height: 1.3; margin-top: 28px; 
          }
      13    .receipt { margin-top: 56px; }
      14    .tick { font-family: var(--mono); font-weight: 600; white-spa
          ce: nowrap; }
      15 +  /* Ticker bezpatkově: v IBM Plex Mono vypadá „O“ jako nula („
         +V00“) */                                                       
      16 +  .ticker { font-weight: 600; }                                
      17    .no { color: var(--loss); }
      18    .yes { color: var(--keep); }
      19    .f-1x1 h1 { font-size: 88px; margin-top: 24px; }
     ...
      29    <p class="lead">A&nbsp;jaké alternativy jsou v&nbsp;ČR dostup
          né.</p>
      30    <div class="receipt">
      31      <div class="row">
      30 -      <span><span class="num">VOO</span> · NYSE Arca<span class
         -="sub">fond z&nbsp;USA</span></span>                           
      32 +      <span><span class="ticker" data-ticker>VOO</span> · NYSE 
         +Arca<span class="sub">fond z&nbsp;USA</span></span>            
      33        <span class="tick no">bez KID</span>
      34      </div>
      35      <div class="row">

● Šablona je opravená. Přidávám test.

● Update(lib/ads.test.ts)
  ⎿  Added 13 lines
      113      for (const ticker of ucitsTickers) expect(all).not.toMatch
           (new RegExp(`\\b${ticker}\\b`));
      114    });
      115  
      116 +  it("ticker a burza ve vizuálu odpovídají data/etfs.json (VOO
          + s písmenem O, ne V00)", () => {                              
      117 +    const voo = fundPairs().find((p) => p.us.id === "VOO")!.us
          +;                                                             
      118 +    const match = html.match(/<span class="ticker" data-ticker
          +>([^<]+)<\/span> · ([^<]+)<span/);                            
      119 +    expect(match).not.toBeNull();                             
      120 +    expect(match![1]).toBe(voo.ticker.value);                 
      121 +    expect(match![2]).toBe(voo.exchange.value);               
      122 +    expect(`${html} ${c.primary_text.join(" ")} ${c.headline}`
          +).not.toMatch(/V00/);                                         
      123 +  });                                                         
      124 +                                                              
      125 +  it("ticker není v monospace (.num), kde „O“ vypadá jako nula
          +", () => {                                                    
      126 +    expect(html).not.toMatch(/class="num">VOO</);             
      127 +  });                                                         
      128 +                                                              
      129    it("vizuál má upozornění", () => {
      130      expect(html).toContain("ne doporučení");
      131    });

● Update(lib/ads.test.ts)
  ⎿  Added 1 line
      3  import { readFileSync } from "node:fs";
      4  import { join } from "node:path";
      5  import { describe, expect, it } from "vitest";
      6 +import { fundPairs } from "./etfs";                             
      7  import { ESMA, FEE_ROWS } from "./fee-rows";
      8  import { computeFees, HERO_INPUT } from "./fees";
      9  import { formatInteger, formatKc, formatPercent } from "./format
         ";

● Bash(npx vitest run lib/ads.test.ts 2>&1 | grep -E "Tests |FAIL|×" ; npm run
      render-ads 2>&1 | tail -1)
  ⎿  3 files changed (binary, mode only or too large to show)
  ⎿  (timeout 3m)

  Ran 1 shell command (ctrl+o to expand)

● Test chytil můj nový komentář v šabloně, který doslova obsahuje „V00“.
  Přeformuluji ho.

● Bash(sed -i 's#v IBM Plex Mono vypadá „O“ jako nula („V00“)#v IBM Plex Mono
      vypadá písmeno O jako nula#' ads/b-zvedavost/ad.html && grep -n "Plex
      Mono" ads/b-zvedavo…)
  ⎿  Updated ads/b-zvedavost/ad.html (+1 -1)
      12    .lead { font-size: 40px; line-height: 1.3; margin-top: 28px; 
          }
      13    .receipt { margin-top: 56px; }
      14    .tick { font-family: var(--mono); font-weight: 600; white-spa
          ce: nowrap; }
      15 -  /* Ticker bezpatkově: v IBM Plex Mono vypadá „O“ jako nula („
         -V00“) */                                                       
      15 +  /* Ticker bezpatkově: v IBM Plex Mono vypadá písmeno O jako n
         +ula */                                                         
      16    .ticker { font-weight: 600; }
      17    .no { color: var(--loss); }
      18    .yes { color: var(--keep); }
  ⎿  (timeout 3m)

  Read 1 file (ctrl+o to expand)

● Bash(cat >> docs/ai-chyby.md <<'EOF'
      | 2026-10-10 | Ticker VOO jsem ve vizuálu reklamy B vysadila monospace
      písmem IBM Plex Mono (třída `.num`, stejně jako na stránc…)
  ⎿  Updated docs/ai-chyby.md (+1 -0)
      22  | 2026-10-09 | Do README jsem napsala „bez souhlasu stránka nes
          tahuje ani kód PostHogu“, aniž bych to ověřila. V `npm run dev`
           se knihovna stahuje z localhostu už před volbou (Turbopack nač
          ítá dynamické importy dopředu); v produkčním buildu tvrzení pla
          tí | Ruční test v prohlížeči (člověk), pak kontrola chunků prod
          ukčního buildu | README upřesněno (dev vs. produkce), E2E test 
          hlídá, že se knihovna v produkci stáhne až po souhlasu |
      23  | 2026-10-09 | Při porovnání chování lomítka na konci URL jsem 
          bez souhlasu schovala necommitnuté změny do `git stash`, abych 
          sestavila předchozí verzi. Ve stejném příkazu `pkill` ukončil c
          elý shell, `git stash pop` se nespustil a změny (proxy `/ingest
          `) zůstaly jen ve stashi | AI si všimla výstupu (exit 144) a hn
          ed zkontrolovala `git stash list` a `git status` | Změny vrácen
          y `git stash pop`, ověřeno, že se nic neztratilo (potvrdil i čl
          ověk). Nové pravidlo v CLAUDE.md: bez výslovného souhlasu žádné
           příkazy, které mění nebo schovávají necommitnuté změny. Na por
          ovnání verzí slouží samostatný `git worktree` |
      24  | 2026-10-10 | Do hero B jsem přidala větu o KID a commitla ji 
          po spuštění jen E2E testů s „hero“ v názvu. Test „lišta nezakry
          je CTA v hero ani na 375 × 667“ je v `consent.spec.ts` a nespus
          til se: CTA hero B se posunulo o 4,5 px pod cookie lištu | Celá
           sada E2E před dalším commitem | Menší mezery v hero B (−8 px),
           celá sada prošla. Rezerva je jen ~3,5 px, poznámka pro designe
          ra v backlogu. Pravidlo: před commitem změny stránky vždy celé 
          `npm run e2e`, ne výběr podle názvu |
      25 +| 2026-10-10 | Ticker VOO jsem ve vizuálu reklamy B vysadila mo
         +nospace písmem IBM Plex Mono (třída `.num`, stejně jako na strá
         +nce). V něm je písmeno O úzké a v PNG se četlo jako „V00“ s nul
         +ami. V souboru byla správně písmena O (ověřeno bajty), chyba by
         +la jen ve čtení. Při kontrole PNG jsem si toho nevšimla | Lidsk
         +á kontrola vizuálu | Ticker ve vizuálu bezpatkovým IBM Plex San
         +s. `lib/ads.test.ts` porovnává ticker a burzu s `data/etfs.json
         +`, zakazuje „V00“ v textech i šabloně a hlídá, že ticker není v
         + `.num`. Stejné riziko na stránce zapsáno do backlogu |        
  ⎿  Updated docs/backlog-texty-design.md (+4 -0)
       9  | ☐ | **Projít texty s ohledem na srozumitelnost pro laika.** N
          apříklad TER, UCITS, KID, PRIIPs, akumulační/distribuční, domic
          il, „náklad = poplatky + ušlý výnos“. | Cílová skupina „slyšela
           o S&P 500“, ale nerozumí poplatkům, měně a dostupnosti v ČR. |
           Revize 2026-10-09 |
      10  | ☐ | **`/potvrzeni` po obnovení stránky znovu ukazuje tlačítko
           „Potvrdit e-mail“**, i když je adresa už potvrzená. Mate to ná
          vštěvníka i testera. Návrh: při načtení zavolat read-only kontr
          olu stavu tokenu (`invalid` / `expired` / `pending` / `already`
          ), která nic nezapisuje. Skenerům odkazů tedy nevadí, potvrzuje
           dál jen tlačítko. Potvrzenému rovnou ukázat srovnání, neplatné
          mu nebo prošlému hlášku. | Zbytečné klepnutí a dojem, že potvrz
          ení „nedrželo“. | Ruční test 4b, 2026-10-09 |
      11  | ☐ | **Hero B na 375 × 667 má rezervu jen ~3,5 px** mezi CTA a
           cookie lištou (po přidání věty o KID, krok 7). Při úpravě písm
          a nebo mezer v hero B hlídá E2E test „lišta nezakryje CTA“. | K
          aždý řádek navíc schová CTA pod lištu na menších telefonech. | 
          E2E test, 2026-10-10 |
      12 +| ☐ | **Reklamy: prázdná spodní třetina ve formátech 1:1 a 4:5.
         +** Obsah je nahoře a pod účtenkou zůstává volná plocha až k dro
         +bnému textu. | Ve feedu je plocha drahá. Volné místo by šlo vyu
         +žít pro větší číslo nebo účtenku. | Kontrola reklam, 2026-10-10
         + |                                                             
      13 +| ☐ | **Reklamy: nadpis B má jiný řez písma než A.** Fraunces m
         +á osu optické velikosti (`opsz`) a při 104 px (B) vybere kontra
         +stnější display řez než při 68 px (A). Sjednotit pevným `font-v
         +ariation-settings: "opsz" …` nebo podobnou velikostí. | Obě var
         +ianty mají působit jako jedna značka. | Kontrola reklam, 2026-1
         +0-10 |                                                         
      14 +| ☐ | **Nadpis reklamy A se ve feedu Facebooku zkrátí:** 39 zna
         +ků, Meta Ads Guide doporučuje 27 (Instagram 40). Podmínka je na
         + začátku, takže číslo bez ní nezůstane, ale zkrácený nadpis kon
         +čí „rozd…“. Zvážit kratší nadpis s podmínkou a podmínku ve vizu
         +álu, např. aby nadpis nesl jen podmínku a číslo bylo ve vizuálu
         +. Pravidlo z právní kontroly platí dál: každé číslo má podmínku
         + přímo u sebe. | Zkrácený nadpis nic neříká. | Kontrola reklam,
         + 2026-10-10 |                                                  
      15 +| ☐ | **Tickery na stránce jsou v IBM Plex Mono (`.num`),** kde
         + písmeno O vypadá jako nula („VOO“ jako „V00“), hlavně v hero B
         + a ve srovnání. Ve vizuálu reklamy B už je ticker bezpatkově. Z
         +vážit totéž na stránce (čísla v mono nechat). | Ticker je klíčo
         +vá informace. Záměna O/0 působí jako chyba v datech. | Kontrola
         + reklam, 2026-10-10 |                                          

● V souboru nuly nebyly: grep na „V00“ v ads/ nic nenašel a výpis bajtů ukázal
  písmena O. Problém byl v písmu. V IBM Plex Mono je O úzké a v PNG se četlo
  jako „V00“. Opraveno a commitnuto (ee78295), nic není pushnuté.

  - Oprava: ticker ve vizuálu B je teď bezpatkovým IBM Plex Sans. Všech 6 PNG je
    přerenderovaných a ve feed-4x5.png je VOO jasně čitelné.
  - Test: lib/ads.test.ts teď porovnává ticker a burzu ve vizuálu s
    data/etfs.json a zakazuje „V00“ v textech i šabloně. Hlídá také, že ticker
    není v monospace písmu. Unit testy: 70/70. Hned při prvním běhu test chytil
    můj nový komentář v šabloně, který doslova obsahoval „V00“.
  - Záznam: chyba je v docs/ai-chyby.md. Při kontrole PNG jsem si toho nevšimla.
  - Backlog: v docs/backlog-texty-design.md jsou tři body, které jsi chtěl:
    - prázdná spodní třetina ve formátech 1:1 a 4:5,
    - jiný řez nadpisu B: písmo Fraunces mění tvar podle velikosti a při 104 px
      vypadá jinak než nadpis A při 68 px,
    - zkrácení nadpisu A ve feedu (39 znaků oproti doporučeným 27) a návrh
      kratšího nadpisu s podmínkou.
  - Navíc v backlogu: stránka má stejný problém s tickery. Hero B a srovnání je
    sázejí v IBM Plex Mono, takže VOO může i tam vypadat jako V00. Na stránce
    jsem nic neměnil.

  Až budeš chtít pokračovat částí B (README), napiš. Před ní prosím udělej
  /export do ai-log/.

❯ Pushnuto. Export udělám až po části B, aby nebyl dvakrát. Pokračuj částí B
  podle schváleného plánu (pořadí sekcí, cílová skupina, výměna hodnoty,
  očekávaná konverze, 3 A/B hypotézy se vzorkem). Pravidlo: každé číslo má
  zdroj s datem, nebo štítek „vlastní předpoklad“ s odůvodněním. Výpočet vzorku
  musí jít v README zopakovat (vzorec a vstupy). Po části B se zastav.
  Commituj, nepushuj.

● Začínám částí B. Nejdřív si načtu skutečné pořadí sekcí v kódu a ověřím
  benchmarky u zdroje.

  Searched for 1 pattern (ctrl+o to expand)

● Fetch(https://unbounce.com/conversion-benchmark-report/)
  ⎿  Received 391.3KB (200 OK)

● Web Search("Unbounce 2024 conversion benchmark report financial services
            median 8.3% investing 3.9%")
  ⎿  Did 1 search in 6s

● Fetch(https://unbounce.com/?p=135737)
  ⎿  Received 383.4KB (200 OK)

● Fetch(https://www.newswire.ca/news-releases/unbounce-s-2024-conversion-benchma
       rk-report-proves-that-attention-spans-are-declining-and-so-are-conversion
       -rates-831617439.html)
  ⎿  Received 207.9KB (200 OK)

● Fetch(https://unbounce.com/conversion-benchmark-report/finance-insurance-conve
       rsion-rate/)
  ⎿  Received 383.4KB (200 OK)

  Searched for 1 pattern, ran 1 shell command (ctrl+o to expand)

● Teď píšu sekce README. Ještě si ověřím, co přesně slibuje formulář, co dělá
  spodní lepicí CTA a co se zobrazí po odeslání, aby „Výměna hodnoty“ seděla s
  kódem.

  Ran 1 shell command (ctrl+o to expand)

● Mám všechno, co potřebuji. Přidám do repa skript pro výpočet vzorku, aby šel
  výsledek zopakovat, a pak napíšu sekce README.

● Write(scripts/sample-size.mjs)
  ⎿  Wrote 24 lines to scripts/sample-size.mjs
       1 // Minimální vzorek na variantu pro A/B test dvou podílů (README
       2 // Oboustranný test, alfa 0,05, síla 80 %. Spuštění: node script
         s/sample-size.mjs [p1 p2]
       3 // n = (z_{α/2}·√(2·p̄·(1−p̄)) + z_β·√(p1·(1−p1) + p2·(1−p2)))² /
       4 const Z_ALPHA = 1.959964; // α = 0,05 oboustranně
       5 const Z_BETA = 0.841621; // síla 80 %
       7 export function sampleSize(p1, p2) {
       8   const pBar = (p1 + p2) / 2;
       9   const top = Z_ALPHA * Math.sqrt(2 * pBar * (1 - pBar)) + Z_BET
      10   return Math.ceil(top ** 2 / (p1 - p2) ** 2);
     … +21 lines (ctrl+o to expand)

  Read 1 file (ctrl+o to expand)

● Nejdřív cílová skupina, výměna hodnoty a pořadí sekcí (první commit).

● Update(README.md)  ⎿  Added 27 lines, removed 3 lines
       9  
      10  ## Cílová skupina
      11  
      12 -TODO – kdo přichází, z jaké reklamy, s jakou bolestí.          
      12 +- **Kdo:** Česko, 25–45 let, na mobilu, přichází z reklamy na F
         +acebooku nebo Instagramu (reklama A nebo B). Persona je pracovn
         +í předpoklad ze zadání, ne změřená data.                       
      13 +- **Co ví:** začíná investovat, nebo je mírně pokročilý. Slyšel
         + o S&P 500 a o VOO, nerozumí poplatkům (TER), měně a tomu, co s
         +i v ČR skutečně koupí.                                         
      14 +- **Bolest:** „Chci investovat do amerického indexu, ale nevím,
         + který fond a proč mi ho broker nenabízí.“                     
      15 +- **Čas:** stránce dává pár sekund. Proto první obrazovka nese 
         +jedno číslo nebo jednu otázku z reklamy a jedno tlačítko.      
      16 +- **Pozor u cílení:** v reklamě na Meta nejde věk 25–45 nastavi
         +t (speciální kategorie, rozhodnutí 42). Personu zasáhnou zájmy 
         +a kreativa, reklamu uvidí i lidé 18–65+.                       
      17  
      18  ## Výměna hodnoty
      19  
      16 -TODO – co návštěvník dostane zdarma, co za e-mail, co hned po o
         -deslání a v kterém okamžiku o kontakt žádáme.                  
      20 +| Kdy | Co návštěvník dostane | Za co |                        
      21 +| --- | --- | --- |                                            
      22 +| Hned, bez e-mailu | Kalkulačka dopadu poplatků v Kč (vlastní 
         +částka, horizont, modelový výnos). Ukázka srovnání 3 dvojic NYS
         +E ↔ UCITS se stejným indexem, se zdrojem a datem | nic |       
      23 +| Po zadání e-mailu, **hned na stránce** | Plné srovnání všech 
         +5 dvojic: TER, měna, akumulace, burza, velikost fondu, registra
         +ce v ČR, ISIN | e-mail (+ nepovinný souhlas s novinkami) |     
      24 +| Po odeslání | Děkovací obrazovka se srovnáním (nečeká se na e
         +-mail), jedna nepovinná otázka „Máte už účet u brokera?“ | – | 
      25 +| E-mailem | Potvrzovací e-mail (double opt-in), tlačítko „Potv
         +rdit a otevřít srovnání“ | potvrzení adresy |                  
      26  
      27 +**Kdy žádáme o kontakt:** až když návštěvník vidí svůj výsledek
         + z kalkulačky (rozhodnutí 4). Nabídka plného srovnání se v kalk
         +ulačce objeví až po první změně vstupu. Formulář je až za ukázk
         +ou srovnání. V hero žádné pole ani zmínka o e-mailu není (hlídá
         + E2E test) a spodní lepicí lišta vede jen na kalkulačku, nikdy 
         +na formulář.                                                   
      28 +                                                               
      29 +Daňový tahák (W-8BEN) stránka zatím neslibuje, protože neexistu
         +je (Co chybí).                                                 
      30 +                                                               
      31  ## Struktura stránky a pořadí sekcí
      32  
      20 -TODO – sekce v pořadí a proč právě toto pořadí.                
      33 +Pořadí v kódu: [`components/Landing.tsx`](components/Landing.ts
         +x).                                                            
      34  
      35 +| # | Sekce | Úkol | Proč právě tady |                         
      36 +| --- | --- | --- | --- |                                      
      37 +| 1 | **Hero** | Navázat na slib reklamy: A číslo 44 200 Kč, B 
         +otázka „Proč si v Česku nekoupíte VOO?“ a odpověď (chybí KID). 
         +Jedno tlačítko | Návštěvník z reklamy během pár sekund kontrolu
         +je, jestli je na správném místě. Hero opakuje slib reklamy dosl
         +ova, jinak odchází. O kontakt v tuhle chvíli nežádáme, protože 
         +zatím nic nedostal |                                           
      38 +| 2 | **Kalkulačka** | Z obecného čísla udělat jeho číslo v Kč 
         +| Nejsilnější hodnota zdarma a jediná osobní. Kdo zadá vlastní 
         +částku, investoval čas a má konkrétní důvod pokračovat. Tlačítk
         +o hero A sem vede přímo |                                      
      39 +| 3 | **Ukázka srovnání** | Ukázat, že plná verze má skutečný o
         +bsah (3 dvojice se zdrojem a datem) | Důkaz kvality před žádost
         +í o e-mail. Vysvětluje i „proč ne VOO“ (PRIIPs/KID), takže sem 
         +vede tlačítko hero B |                                         
      40 +| 4 | **Formulář** | E-mail za plné srovnání (5 dvojic, víc par
         +ametrů) | Teprve teď návštěvník ví, co dostane, a viděl kousek 
         +zdarma. Jedno pole, výsledek hned na stránce |                 
      41 +| 5 | **Důvěra** | Kdo za stránkou stojí, odkud jsou data, rizi
         +kové upozornění | Pro ty, kdo váhají: hledají to až při rozhodo
         +vání o e-mailu, ne před ním. Rizikové upozornění tu je celé, kr
         +átká upozornění jsou i u čísel výše |                          
      42 +| 6 | **Patička** | Provozovatel, zásady ochrany údajů, nastave
         +ní cookies | Povinné údaje. Nastavení cookies jde kdykoli změni
         +t |                                                            
      43 +                                                               
      44 +Hero B vede rovnou na srovnání (3), ne na kalkulačku. Kdo přiše
         +l s otázkou „proč ne VOO“, chce nejdřív odpověď. Kalkulačku pře
         +skočí, ale formulář (4) má hned pod srovnáním.                 
      45 +                                                               
      46  ## Očekávaná konverze
      47  
      48  TODO – odhad konverze s odůvodněním a zdrojem benchmarku.

  Ran 1 shell command (ctrl+o to expand)

● Teď sekce Očekávaná konverze.

● Update(README.md)
  ⎿  Added 50 lines, removed 1 line
       45  
       46  ## Očekávaná konverze
       47  
       48 -TODO – odhad konverze s odůvodněním a zdrojem benchmarku.     
       48 +**Odhad: 4 % zobrazení stránky skončí leadem a 2 % potvrzeným 
          +leadem.** Rozpětí: 2–6 % leadů. Kromě benchmarku níže jsou vše
          +chna čísla **vlastní předpoklad**. Ověřená data pro tento typ 
          +stránky a publika v ČR nemáme. Odhad nahradí čísla z prvního t
          +ýdne kampaně.                                                 
       49  
       50 +### Benchmark                                                 
       51 +                                                              
       52 +[Unbounce – Conversion Benchmark Report 2024](https://unbounce
          +.com/conversion-benchmark-report/finance-insurance-conversion-
          +rate/), data za 23. 7. 2023 – 23. 7. 2024, 41 000 landing page
          +s a 57 milionů konverzí ([tisková zpráva 5. 9. 2024](https://w
          +ww.newswire.ca/news-releases/unbounce-s-2024-conversion-benchm
          +ark-report-proves-that-attention-spans-are-declining-and-so-ar
          +e-conversion-rates-831617439.html)). Staženo 2026-10-10.      
       53 +                                                              
       54 +| Medián konverze | Hodnota |                                 
       55 +| --- | --- |                                                 
       56 +| Všechna odvětví | 6,6 % |                                   
       57 +| Finanční služby | 8,3 % |                                   
       58 +| – z toho pojištění | 18,2 % |                               
       59 +| – z toho úvěry | 8,8 % |                                    
       60 +| – **z toho investice** | **3,9 %** |                        
       61 +| Finanční služby, placené sociální sítě | 9,3 % (Facebook 10,
          +1 %, Instagram 15,5 %) |                                      
       62 +                                                              
       63 +**Proč kotvíme na 3,9 % (investice), ne na 8,3 %:** finanční m
          +edián táhne nahoru pojištění (18,2 %), které s naším tématem n
          +esouvisí. Unbounce navíc počítá jako konverzi i proklik, ne je
          +n odeslaný formulář, a celosvětová data nejsou česká. 9,3 % u 
          +sociálních sítí platí pro finance celkem, ne pro investice. Pr
          +oto bereme 4 %, což je zhruba medián investic. Hodnota nahoru 
          +i dolů je stejně možná: proti nám hraje studené publikum z fee
          +du, pro nás formulář s jediným polem a hodnota ukázaná před žá
          +dostí.                                                        
       64 +                                                              
       65 +### Rozpad funnelu (vlastní předpoklad)                       
       66 +                                                              
       67 +Podíly jsou z návštěvníků, kteří stránku opravdu viděli (zobra
          +zení stránky). Kroky odpovídají eventům v [Měření](#měření).  
       68 +                                                              
       69 +| Krok | Event | Z prokliků | Ze zobrazení | Z předchozího kro
          +ku | Proč |                                                   
       70 +| --- | --- | --- | --- | --- | --- |                         
       71 +| Proklik z reklamy | (Meta: link click) | 100 % | – | – | |  
       72 +| Zobrazení stránky | `page_view` (Meta: landing page view) | 
          +80 % | 100 % | 80 % | Část lidí odejde, než se stránka v prohl
          +ížeči Facebooku/Instagramu načte. Stránka je statická (LCP cíl
          + < 2,5 s), takže ztráta by měla být malá |                    
       73 +| Interakce s kalkulačkou | `calc_start` | 28 % | 35 % | 35 % 
          +| Hero A vede tlačítkem přímo na kalkulačku, hero B na srovnán
          +í, takže u B bude nižší. Část lidí z feedu stránku jen proletí
          + |                                                            
       74 +| Zobrazení formuláře | `form_view` | 24 % | 30 % | – | Formul
          +ář je čtvrtý v pořadí. Kdo došel až sem, prošel kalkulačku neb
          +o srovnání. Event počítá i ty, kdo kalkulačku přeskočili |    
       75 +| **Lead** | `form_submit` | **3,2 %** | **4 %** | 13 % z `for
          +m_view` | Kotva na benchmarku investic (3,9 %) |              
       76 +| **Potvrzený lead** | `lead_confirmed` | **1,6 %** | **2 %** 
          +| 50 % z leadů | Ověřený benchmark pro míru potvrzení double o
          +pt-in jsme nenašli (jen blogy bez metodiky). Volíme 50 %, prot
          +ože srovnání návštěvník dostane už na stránce, takže k potvrze
          +ní e-mailu má slabší motivaci. Tlačítko v e-mailu proto zní „P
          +otvrdit a otevřít srovnání“ |                                 
       77 +                                                              
       78 +### Cena za lead (vlastní předpoklad)                         
       79 +                                                              
       80 +Cenu prokliku (CPC) pro finance na Meta v ČR z ověřeného zdroj
          +e nemáme, proto tři scénáře. Lead = 3,2 % prokliků, potvrzený 
          +lead = 1,6 % prokliků.                                        
       81 +                                                              
       82 +| CPC | Cena za lead | Cena za potvrzený lead | Testovací rozp
          +očet 4 200 Kč na variantu → leadů |                           
       83 +| --- | --- | --- | --- |                                     
       84 +| 5 Kč | 156 Kč | 313 Kč | 27 |                               
       85 +| 10 Kč | 313 Kč | 625 Kč | 13 |                              
       86 +| 20 Kč | 625 Kč | 1 250 Kč | 7 |                             
       87 +                                                              
       88 +Výpočet: cena za lead = CPC / 0,032, potvrzený = CPC / 0,016, 
          +leady = 4 200 / CPC × 0,032 (zaokrouhleno).                   
       89 +                                                              
       90 +### Jak se konverze změří                                     
       91 +                                                              
       92 +| Metrika | Čitatel | Jmenovatel | Poznámka |                 
       93 +| --- | --- | --- | --- |                                     
       94 +| Lead / zobrazení stránky podle reklamy | Supabase: počet řád
          +ků v `leads` podle `ad_variant` a `utm_content` (SQL v [Měření
          +](#měření)) | Meta Ads Manager: *landing page views* podle rek
          +lamy | Obě čísla jsou úplná a nezávisí na cookies. Podle tohot
          +o poměru se rozhoduje |                                       
       95 +| Potvrzený lead / lead | Supabase: `count(double_opt_in_at)` 
          +| Supabase: `count(*)` | Exportovat do 30 dnů, nepotvrzené se 
          +pak mažou |                                                   
       96 +| Odpady mezi kroky | PostHog: funnel 8 eventů, rozpis podle `
          +ad_variant` | – | Jen návštěvníci, kteří povolili měření. Vzor
          +ek může být posunutý (kdo souhlasí, bývá ochotnější), takže br
          +át jako poměry, ne absolutní čísla |                          
       97 +| CTR, CPC, landing page views | Meta Ads Manager | – | Rozpis
          + podle umístění (feed / Stories) |                            
       98 +                                                              
       99  ## Hypotézy pro A/B test
      100  
      101  TODO – tři hypotézy seřazené podle očekávaného dopadu.

● Čísla v tabulkách jsem přepočítal a sedí, třeba 10 / 0,032 ≈ 313 Kč a 420 ×
  0,032 ≈ 13 leadů. Jedno tvrzení bez zdroje („kdo souhlasí, bývá ochotnější“)
  zmírňuji.

● Bash(sed -i 's/Vzorek může být posunutý (kdo souhlasí, bývá ochotnější), takže
      brát jako poměry, ne absolutní čísla/Souhlasící se mohou chovat jinak než
      ostatní (nem…)
  ⎿  Updated README.md (+1 -1)
      93  | --- | --- | --- | --- |
      94  | Lead / zobrazení stránky podle reklamy | Supabase: počet řádk
          ů v `leads` podle `ad_variant` a `utm_content` (SQL v [Měření](
          #měření)) | Meta Ads Manager: *landing page views* podle reklam
          y | Obě čísla jsou úplná a nezávisí na cookies. Podle tohoto po
          měru se rozhoduje |
      95  | Potvrzený lead / lead | Supabase: `count(double_opt_in_at)` |
           Supabase: `count(*)` | Exportovat do 30 dnů, nepotvrzené se pa
          k mažou |
      96 -| Odpady mezi kroky | PostHog: funnel 8 eventů, rozpis podle `a
         -d_variant` | – | Jen návštěvníci, kteří povolili měření. Vzorek
         - může být posunutý (kdo souhlasí, bývá ochotnější), takže brát 
         -jako poměry, ne absolutní čísla |                              
      96 +| Odpady mezi kroky | PostHog: funnel 8 eventů, rozpis podle `a
         +d_variant` | – | Jen návštěvníci, kteří povolili měření. Souhla
         +sící se mohou chovat jinak než ostatní (neměřili jsme), takže b
         +rát jako orientační poměry, ne absolutní čísla |               
      97  | CTR, CPC, landing page views | Meta Ads Manager | – | Rozpis 
          podle umístění (feed / Stories) |
      98  
      99  ## Hypotézy pro A/B test

● Teď hypotézy pro A/B test. Přepočet vzorku na prokliky a Kč:

  Ran 1 shell command (ctrl+o to expand)

● Update(README.md)
  ⎿  Added 51 lines, removed 1 line
       98  
       99  ## Hypotézy pro A/B test
      100  
      101 -TODO – tři hypotézy seřazené podle očekávaného dopadu.        
      101 +Seřazené podle očekávaného dopadu na počet leadů. Odhady zlepš
          +ení jsou **vlastní předpoklad**, ověřené benchmarky pro tyto z
          +měny nemáme.                                                  
      102  
      103 +### Výpočet vzorku                                            
      104 +                                                              
      105 +Test dvou podílů, oboustranný, α = 0,05, síla 80 %:           
      106 +                                                              
      107 +```                                                           
      108 +n = ( z_α/2 · √(2 · p̄ · (1 − p̄)) + z_β · √(p1 · (1 − p1) + p2 
          +· (1 − p2)) )² / (p1 − p2)²                                   
      109 +p̄ = (p1 + p2) / 2,   z_α/2 = 1,96,   z_β = 0,84               
      110 +```                                                           
      111 +                                                              
      112 +- `n` = počet **zobrazení stránky na variantu**.              
      113 +- Přepočet na prokliky: `n / 0,8` (80 % prokliků se zobrazí, [
          +Očekávaná konverze](#očekávaná-konverze)).                    
      114 +- Cena: prokliky × CPC. Počítáme s CPC 10 Kč, vlastní předpokl
          +ad (prostřední scénář).                                       
      115 +- Zopakovat: `node scripts/sample-size.mjs` (všechny případy n
          +íže), nebo `node scripts/sample-size.mjs 0.04 0.06`.          
      116 +                                                              
      117 +| Hypotéza | p1 → p2 (relativně) | n zobrazení na variantu | P
          +rokliků na variantu | Kč na variantu (CPC 10) | Dní při 300 Kč
          +/den | Dní při 1 500 Kč/den |                                 
      118 +| --- | --- | --- | --- | --- | --- | --- |                   
      119 +| H1 | 4 % → 6 % (+50 %) | 1 863 | 2 329 | 23 290 | 78 | 16 | 
      120 +| H1 | 4 % → 5,2 % (+30 %) | 4 783 | 5 979 | 59 790 | 200 | 40
          + |                                                            
      121 +| H2 | 4 % → 5 % (+25 %) | 6 745 | 8 432 | 84 320 | 282 | 57 |
      122 +| H3 | 35 % → 40,25 % (+15 %), jen souhlasící | 1 336 souhlasí
          +cích = 2 672 zobrazení | 3 340 | 33 400 | 112 | 23 |          
      123 +                                                              
      124 +**Co z toho plyne:** testovací rozpočet z [`ads/`](ads/README.
          +md#cílení-a-rozpočet-obě-varianty-stejně) (300 Kč denně na var
          +iantu, 7 dní) rozliší CTR a cenu prokliku, ale **rozdíl v lead
          +ech ne**. Test na leady potřebuje zhruba 1 500 Kč denně na var
          +iantu a 2–8 týdnů, podle toho, jak velký rozdíl chceme poznat.
          + Menší rozdíly (+10 %) při tomto objemu prakticky nezměříme. P
          +roto testujeme jen změny, od kterých čekáme velký účinek.     
      125 +                                                              
      126 +### H1: Reklama A (úspora) vs. B (zvědavost) včetně jejich her
          +o                                                             
      127 +                                                              
      128 +- **Co měníme:** celou dvojici reklama + hero. A slibuje konkr
          +étní číslo (44 200 Kč) a vede na kalkulačku, B klade otázku (p
          +roč ne VOO) a vede na srovnání.                               
      129 +- **Testuje kombinaci reklama + hero, ne jen kreativu.** Každá
          + reklama vede na vlastní hero, takže výsledek neřekne, jestli 
          +vyhrála reklama, nebo hero. Na to by byl potřeba další test (s
          +tejná reklama, dvě hero).                                     
      130 +- **Proč čekáme velký rozdíl:** obě varianty přivedou jiné lid
          +i s jiným záměrem. A oslovuje ty, kdo řeší náklady (a kalkulač
          +ka jim dá osobní číslo). B oslovuje zvědavé, kteří o VOO slyše
          +li. U B čekáme vyšší CTR (otázka), u A vyšší podíl leadů (konk
          +rétní hodnota a cesta přes kalkulačku). Na čem záleží: **lead 
          +na proklik**, ne CTR. Odhad rozdílu +50 % je vlastní předpokla
          +d.                                                            
      131 +- **Metrika:** primární lead / zobrazení stránky (Supabase pod
          +le `ad_variant` / Meta landing page views). Sekundární: cena z
          +a lead, potvrzený lead / lead, CTR.                           
      132 +- **Vzorek:** 1 863 zobrazení na variantu pro +50 %, 4 783 pro
          + +30 %.                                                       
      133 +- **Spuštění:** už připravené. Dvě reklamy s `utm_content=a-us
          +pora` a `b-zvedavost`. `proxy.ts` vybere hero a stránka uloží 
          +`ad_variant`. V Meta rovnoměrné rozdělení publika přes funkci 
          +A/B test v Ads Manageru, ne dvě reklamy v jedné sadě, kde by M
          +eta mohla rozpočet sama přesunout k jedné z nich. Konkrétní na
          +stavení ověřit v Ads Manageru.                                
      134 +                                                              
      135 +### H2: Formulář hned pod výsledkem kalkulačky vs. až za srovn
          +áním                                                          
      136 +                                                              
      137 +- **Co měníme:** dnes vede nabídka v kalkulačce odkazem na for
          +mulář, který je až za ukázkou srovnání. Ve variantě bude pole 
          +pro e-mail přímo pod výsledkem kalkulačky.                    
      138 +- **Proč čekáme zlepšení:** výsledek kalkulačky je chvíle nejv
          +ětšího zájmu (rozhodnutí 4). Každý posun a sekce navíc mezi vý
          +sledkem a formulářem jsou příležitost odejít. Riziko: kdo ješt
          +ě neviděl ukázku srovnání, neví, co za e-mail dostane. Proto m
          +ůže vyjít i hůř. Odhad +25 % je vlastní předpoklad.           
      139 +- **Metrika:** primární lead / zobrazení stránky (Supabase pod
          +le `utm_content`). Sekundární (PostHog, jen souhlasící): `form
          +_submit / calc_result`.                                       
      140 +- **Vzorek:** 6 745 zobrazení na variantu (+25 %). Ze tří test
          +ů nejdražší, proto až po H1 a jen na vítězné reklamě.         
      141 +- **Spuštění (potřebuje kód):** varianta rozvržení v `utm_cont
          +ent`, např. `a-uspora-f1` (dnešní) a `a-uspora-f2` (formulář p
          +od kalkulačkou). `proxy.ts` podle přípony přepíše na staticky 
          +předrenderovanou stránku (jako dnes `/v/b`) a `Landing` dostan
          +e parametr rozvržení. `ad_variant` zůstává `a`/`b` a tabulka `
          +leads` se nemění: `utm_content` se ukládá už teď, takže stačí 
          +`group by utm_content`. V Meta dvě kopie vítězné reklamy s růz
          +ným `utm_content` v A/B testu. PostHog feature flags nepoužívá
          +me, protože bez souhlasu s měřením se PostHog nenačte (rozhodn
          +utí 33) a varianta by se nevybrala.                           
      142 +                                                              
      143 +### H3: Hero A s posuvníkem částky přímo v hero vs. tlačítko „
          +Spočítat pro mě“                                              
      144 +                                                              
      145 +- **Co měníme:** v hero A místo tlačítka jeden posuvník „Měsíč
          +ně investuji“. Číslo 44 200 Kč se přepočítá hned, plná kalkula
          +čka zůstává níž.                                              
      146 +- **Proč čekáme zlepšení:** interakce bez kliknutí a posunu st
          +ránky. Návštěvník uvidí svoje číslo v první obrazovce. Riziko:
          + hero přestane být jedna zpráva a jedno číslo, a jakmile návšt
          +ěvník posune, číslo přestane odpovídat slibu reklamy (2 000 Kč
          +). Výchozí hodnota proto musí zůstat 2 000 Kč. Odhad +15 % je 
          +vlastní předpoklad.                                           
      147 +- **Metrika:** primární `calc_start / page_view` (PostHog, jen
          + souhlasící). Na leady by test potřeboval vzorek jako H2. Seku
          +ndární: lead / zobrazení stránky (Supabase).                  
      148 +- **Vzorek:** 1 336 **souhlasících** návštěvníků na variantu. 
          +Podíl souhlasu s měřením zatím neznáme. Při předpokladu 50 % (
          +vlastní, nahradit skutečným podílem z prvního týdne) to je 2 6
          +72 zobrazení.                                                 
      149 +- **Spuštění (potřebuje kód):** stejně jako H2 přes příponu `u
          +tm_content` (`a-uspora-h1` / `a-uspora-h2`) a staticky předren
          +derovanou variantu. E2E testy: číslo v hero při výchozí hodnot
          +ě stále 44 200 Kč, tlačítko a vstup nad ohybem i na 375 × 667 
          +s cookie lištou.                                              
      150 +                                                              
      151 +**Pravidla pro všechny testy:** vždy jen jeden test naráz na s
          +tejném publiku. Délku určit předem podle vzorku a neukončovat 
          +test dřív, jakmile se objeví „vítěz“. Vždy aspoň celý týden kv
          +ůli rozdílu mezi pracovními dny a víkendem. Výsledky z PostHog
          +u (jen souhlasící) brát jako doplněk k Supabase.              
      152 +                                                              
      153  ## Měření
      154  
      155  Funnel: `page_view → hero_cta_click → calc_start → calc_result
            → compare_view → form_view → form_submit → lead_confirmed`. K
           aždý event nese `ad_variant` (`a`/`b`) a UTM parametry z URL (
           [`lib/track.ts`](lib/track.ts)).

● Ověřím ještě tvrzení o +10 %, projedu lint skriptu a zkontroluji, že všechny
  odkazy v README vedou na existující soubory.

  Ran 1 shell command (ctrl+o to expand)

● Pro +10 % je potřeba 39 475 zobrazení na variantu. Doplním to číslo do README
  a skript přidám do „Spuštění lokálně“.

● Bash(sed -i 's/Menší rozdíly (+10 %) při tomto objemu prakticky
      nezměříme./Menší rozdíly prakticky nezměříme: +10 % (4 % → 4,4 %) by
      chtělo 39 475 zobrazení na varia…)
  ⎿  Updated README.md (+2 -1)
      121  | H2 | 4 % → 5 % (+25 %) | 6 745 | 8 432 | 84 320 | 282 | 57 |
      122  | H3 | 35 % → 40,25 % (+15 %), jen souhlasící | 1 336 souhlasí
           cích = 2 672 zobrazení | 3 340 | 33 400 | 112 | 23 |
      123  
      124 -**Co z toho plyne:** testovací rozpočet z [`ads/`](ads/README.
          -md#cílení-a-rozpočet-obě-varianty-stejně) (300 Kč denně na var
          -iantu, 7 dní) rozliší CTR a cenu prokliku, ale **rozdíl v lead
          -ech ne**. Test na leady potřebuje zhruba 1 500 Kč denně na var
          -iantu a 2–8 týdnů, podle toho, jak velký rozdíl chceme poznat.
          - Menší rozdíly (+10 %) při tomto objemu prakticky nezměříme. P
          -roto testujeme jen změny, od kterých čekáme velký účinek.     
      124 +**Co z toho plyne:** testovací rozpočet z [`ads/`](ads/README.
          +md#cílení-a-rozpočet-obě-varianty-stejně) (300 Kč denně na var
          +iantu, 7 dní) rozliší CTR a cenu prokliku, ale **rozdíl v lead
          +ech ne**. Test na leady potřebuje zhruba 1 500 Kč denně na var
          +iantu a 2–8 týdnů, podle toho, jak velký rozdíl chceme poznat.
          + Menší rozdíly prakticky nezměříme: +10 % (4 % → 4,4 %) by cht
          +ělo 39 475 zobrazení na variantu. Proto testujeme jen změny, o
          +d kterých čekáme velký účinek.                                
      125  
      126  ### H1: Reklama A (úspora) vs. B (zvědavost) včetně jejich her
           o
      127  
     ...
      395  npm test             # unit testy výpočtu (Vitest)
      396  npm run check-data   # kontrola zdrojů v data/
      397  npm run render-ads   # vizuály reklam ads/*/ad.html → PNG (pot
           řebuje síť kvůli fontům)
      398 +node scripts/sample-size.mjs   # vzorek pro A/B test (README, 
          +Hypotézy)                                                     
      399  npx playwright install --with-deps chromium   # jednou
      400  npm run e2e          # Playwright, mobil 375 px (ostré služby 
           nevolá, viz playwright.config.ts)
      401  ```

● Unbounce ještě přidám do tabulky „Zdroje dat“, ať tam jsou všechny zdroje
  pohromadě.

● Bash(sed -i '/^| Ověření finančních inzerentů v Google Ads (ČR) |/a |
      Benchmark konverze landing pages (finanční služby, investice, placené
      sociální sítě) | Unbounce…)
  ⎿  Updated README.md (+1 -0)
      374  | Speciální kategorie reklam na Meta, omezení cílení | Meta Ma
           rketing API – Special Ad Categories | [developers.facebook.com
           ](https://developers.facebook.com/docs/marketing-api/audiences
           /special-ad-category) | 2026-10-10 |
      375  | Délky textů a ochranné zóny reklam na Meta | Meta Ads Guide 
           – Instagram feed, Facebook feed, Instagram Stories | [facebook
           .com/business/ads-guide](https://www.facebook.com/business/ads
           -guide/update/image/instagram-story) | 2026-10-10 |
      376  | Ověření finančních inzerentů v Google Ads (ČR) | Google Adve
           rtising Policies Help – červen 2026 a Financial Services Verif
           ication | [support.google.com](https://support.google.com/adsp
           olicy/answer/17127726?hl=en), [ČR](https://support.google.com/
           adspolicy/answer/15332527?hl=en&co=GENIE.CountryCode%3DCZ) | 2
           026-10-10 |
      377 +| Benchmark konverze landing pages (finanční služby, investice
          +, placené sociální sítě) | Unbounce – Conversion Benchmark Rep
          +ort 2024 (data 23. 7. 2023 – 23. 7. 2024) | [unbounce.com](htt
          +ps://unbounce.com/conversion-benchmark-report/finance-insuranc
          +e-conversion-rate/), [tisková zpráva](https://www.newswire.ca/
          +news-releases/unbounce-s-2024-conversion-benchmark-report-prov
          +es-that-attention-spans-are-declining-and-so-are-conversion-ra
          +tes-831617439.html) | 2026-10-10 |                            
      378  
      379  ## Právní upozornění
      380  

● Část B je hotová v 5 commitech, nic není pushnuté. Zastavuji se, abys ji mohl
  zkontrolovat.

  Co je v README:
  - Cílová skupina a výměna hodnoty: kdo přichází, co dostane zdarma, co za
    e-mail a po odeslání a kdy žádáme o kontakt. Popis odpovídá kódu, například
    nabídka plného srovnání se v kalkulačce ukáže až po změně vstupu a lepicí
    lišta vede jen na kalkulačku.
  - Pořadí sekcí: tabulka s úkolem každé sekce a důvodem jejího místa. Je tam i
    vysvětlení, proč hero B vede rovnou na srovnání, ne na kalkulačku.
  - Očekávaná konverze: 4 % zobrazení stránky skončí leadem a 2 % potvrzeným
    leadem, rozpětí 2–6 %.
    - Zdroj benchmarku je Unbounce Conversion Benchmark Report 2024 (data
      od 23. 7. 2023 do 23. 7. 2024). Kotvíme na mediánu investic 3,9 %, ne na
      mediánu financí 8,3 %, který zvedá pojištění s 18,2 %.
    - Unbounce počítá jako konverzi i proklik, ne jen odeslaný formulář. Proto
      je jeho číslo pro náš lead spíš horní odhad.
    - Kroky funnelu, míra potvrzení 50 % a cena prokliku jsou označené jako
      vlastní předpoklad s odůvodněním. Pro míru potvrzení double opt-in jsem
      ověřený zdroj nenašel.
    - Tabulka měření říká, co se bere ze Supabase, co z Meta Ads Manageru a co z
      PostHogu.
  - Tři hypotézy pro A/B test:
    a. Reklama A vs. B: testuje kombinaci reklama + hero. Je připravená ke
       spuštění hned.
    b. Formulář přímo pod výsledkem kalkulačky.
    c. Posuvník částky přímo v hero A.

    Hypotézy 2 a 3 potřebují kód: variantu stránky podle přípony v utm_content.
    Databáze se měnit nemusí, protože utm_content už ukládáme.
  - Výpočet vzorku: v README je vzorec i vstupy a scripts/sample-size.mjs ho
    zopakuje. Například 4 % → 5 % potřebuje 6 745 zobrazení na variantu, což
    odpovídá běžným kalkulačkám vzorku.

  Hlavní závěr výpočtu: testovací rozpočet z části A (300 Kč denně na variantu,
  7 dní) rozliší CTR a cenu prokliku, ale rozdíl v leadech ne. Test na leady
  potřebuje zhruba 1 500 Kč denně na variantu a 2–8 týdnů. Rozdíl +10 % by
  vyžadoval 39 475 zobrazení na variantu. V README je to napsané výslovně, aby
  čtenář nečekal od týdenního testu verdikt o leadech.

  Neověřené:
  - Rovnoměrné rozdělení publika: funkci A/B test v Ads Manageru uvádím s
    poznámkou „ověřit v Ads Manageru“. Žádný zdroj jsem k ní nehledal.
  - Podíl souhlasu s měřením (50 %) u hypotézy 3: vlastní předpoklad, nahradí ho
    skutečný podíl z prvního týdne.

  Teď můžeš udělat /export do ai-log/.