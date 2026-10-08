import Link from "next/link";
import { OPERATOR } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-xl border-t-2 border-ink px-4 pt-6 pb-24 text-[13px] leading-5 text-muted">
      <p className="font-semibold text-ink">{OPERATOR.about}</p>
      <p>Autor: {OPERATOR.name}</p>
      {OPERATOR.ico && <p>IČO: {OPERATOR.ico}</p>}
      {OPERATOR.address && <p>Sídlo: {OPERATOR.address}</p>}
      <p>
        Kontakt:{" "}
        <a href={`mailto:${OPERATOR.email}`} className="underline">
          {OPERATOR.email}
        </a>
      </p>
      <nav aria-label="Právní informace" className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        <Link href="/zasady" className="underline">
          Zásady ochrany osobních údajů
        </Link>
        {/* Krok 4: tlačítko otevře lištu nastavení cookies */}
        <Link href="/zasady#cookies" className="underline">
          Nastavení cookies
        </Link>
      </nav>
    </footer>
  );
}
