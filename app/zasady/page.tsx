import Link from "next/link";
import type { Metadata } from "next";
import { CONSENT, OPERATOR } from "@/lib/site";

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
        <li>Ukládáme čas a znění udělených souhlasů.</li>
      </ul>

      <h2 className="mt-8 font-display text-xl font-semibold">Doba uložení, příjemci, vaše práva</h2>
      <p className="mt-1">[doplnit]</p>

      <h2 id="cookies" className="mt-8 font-display text-xl font-semibold">
        Cookies
      </h2>
      <p className="mt-1">[doplnit – analytika a reklamní pixely jen po aktivním souhlasu]</p>
    </main>
  );
}
