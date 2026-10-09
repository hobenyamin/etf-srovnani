import Link from "next/link";
import type { Metadata } from "next";
import { ANALYTICS_COOKIE_DAYS } from "@/lib/analytics";
import { CONSENT_KEY } from "@/lib/consent";
import { CONSENT, OPERATOR, RETENTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů",
  robots: { index: false },
};

// Kostra. Plné znění doplní provozovatel a projde právní kontrolou před spuštěním.
export default function Zasady() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 text-[15px] leading-6">
      <Link href="/" className="text-[13px] underline">
        ← Zpět na srovnání
      </Link>
      <h1 className="mt-4 font-display text-[34px] leading-[38px] font-semibold">Zásady ochrany osobních údajů</h1>
      <p className="mt-4 border-2 border-loss p-3 font-semibold text-loss">
        Koncept – plné znění doplní provozovatel a před spuštěním projde právní kontrolou.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Správce</h2>
      <p className="mt-1">
        {[OPERATOR.name, OPERATOR.ico && `IČO ${OPERATOR.ico}`, OPERATOR.address, OPERATOR.email]
          .filter(Boolean)
          .join(", ")}
        . {OPERATOR.about}
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Jaké údaje a proč</h2>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        <li>E-mail: {CONSENT.delivery}</li>
        <li>Novinky e-mailem jen se souhlasem (čl. 6 odst. 1 písm. a GDPR), odvolatelným v&nbsp;každém e-mailu.</li>
        <li>Ukládáme čas a znění udělených souhlasů a informace, kterou jste u formuláře viděli.</li>
        <li>
          K e-mailu ukládáme i to, z jaké reklamy jste přišli (UTM parametry), zadání kalkulačky a typ prohlížeče.
          IP adresu neukládáme.
        </li>
        <li>Data jsou uložena v EU (Supabase, Frankfurt).</li>
      </ul>

      <h2 className="mt-8 font-display text-xl font-semibold">Doba uložení</h2>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        <li>
          Nepotvrzenou adresu (bez kliknutí na potvrzovací odkaz v e-mailu) automaticky mažeme po{" "}
          {RETENTION.unconfirmedDays} dnech.
        </li>
        <li>Potvrzenou adresu do odvolání souhlasu nebo žádosti o výmaz, nejdéle [doplní provozovatel].</li>
      </ul>

      <h2 className="mt-8 font-display text-xl font-semibold">Potvrzení e-mailu</h2>
      <p className="mt-1">
        Po odeslání formuláře vám pošleme e-mail s&nbsp;odkazem. Teprve klepnutím na tlačítko „Potvrdit e-mail“ na
        stránce, kam odkaz vede, potvrdíte, že adresa patří vám. Uložíme čas potvrzení.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Příjemci</h2>
      <p className="mt-1">Zpracovatelé, kteří pro nás údaje technicky zpracovávají:</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        <li>Supabase – databáze (EU, Frankfurt)</li>
        <li>Resend – odesílání e-mailů (EU, Irsko)</li>
        <li>Vercel – provoz webu</li>
      </ul>
      <p className="mt-1">Údaje nepředáváme žádným dalším příjemcům ani partnerům. [doplní provozovatel]</p>

      <h2 className="mt-8 font-display text-xl font-semibold">Vaše práva</h2>
      <p className="mt-1">
        Máte právo na přístup ke svým údajům, jejich opravu a výmaz, právo odvolat souhlas a vznést námitku. Stačí
        napsat na{" "}
        <a href={`mailto:${OPERATOR.email}`} className="underline">
          {OPERATOR.email}
        </a>{" "}
        z adresy, které se žádost týká. Odpovíme nejpozději do 1 měsíce. Stížnost můžete podat u Úřadu pro ochranu
        osobních údajů (
        <a href="https://uoou.gov.cz" className="underline">
          uoou.gov.cz
        </a>
        ).
      </p>

      <h2 id="cookies" className="mt-8 font-display text-xl font-semibold">
        Cookies
      </h2>
      <p className="mt-1">
        Bez vašeho souhlasu neměříme nic: nenačteme žádný měřicí skript, nic neodešleme a&nbsp;do prohlížeče uložíme jen
        vaši volbu.
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          <strong>Nezbytné:</strong> <code>{CONSENT_KEY}</code> v&nbsp;úložišti prohlížeče – vaše volba v&nbsp;liště cookies, aby se
          lišta neukazovala znovu. Ukládá se bez souhlasu, protože bez ní by volba nešla dodržet.
        </li>
        <li>
          <strong>Měření (jen se souhlasem):</strong> PostHog Cloud EU (servery v&nbsp;EU). Cookie a záznam v&nbsp;úložišti
          prohlížeče začínající <code>ph_</code> s&nbsp;náhodným identifikátorem prohlížeče, platnost{" "}
          {ANALYTICS_COOKIE_DAYS} dní. Měříme jen kroky na stránce (zobrazení, použití kalkulačky, zobrazení
          a&nbsp;odeslání formuláře, potvrzení e-mailu), variantu reklamy a&nbsp;UTM parametry odkazu. PostHog k&nbsp;nim
          přidává technické údaje: adresu stránky, typ prohlížeče a&nbsp;zařízení, jazyk, časové pásmo a&nbsp;velikost
          obrazovky. Žádné nahrávání obrazovky, žádné klikání mimo tyto kroky. Váš e-mail ani tokeny z&nbsp;odkazů
          v&nbsp;e-mailech do PostHogu neposíláme.
        </li>
        <li>
          <strong>Reklamní cookies a pixely</strong> (Meta, Google) nepoužíváme.
        </li>
      </ul>
      <p className="mt-2">
        Souhlas můžete kdykoli změnit nebo odvolat odkazem „Nastavení cookies“ v&nbsp;patičce. Po odvolání údaje PostHogu
        z&nbsp;prohlížeče smažeme.
      </p>
    </main>
  );
}
