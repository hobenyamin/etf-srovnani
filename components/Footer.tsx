import Link from "next/link";
import { OPERATOR, orTodo } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-xl border-t-2 border-ink px-4 pt-6 pb-24 text-[13px] leading-5 text-muted">
      <p className="font-semibold text-ink">{orTodo(OPERATOR.name, "název provozovatele")}</p>
      <p>IČO: {orTodo(OPERATOR.ico, "IČO")}</p>
      <p>Sídlo: {orTodo(OPERATOR.address, "sídlo")}</p>
      <p>Kontakt: {OPERATOR.email ? <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a> : orTodo(null, "e-mail")}</p>
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
