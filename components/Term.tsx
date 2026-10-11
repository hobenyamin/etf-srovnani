"use client";

import { useId, useState } from "react";

/**
 * Odborný pojem s vysvětlením na klepnutí: tlačítko „?“ (aria-expanded) odkryje jednu větu hned
 * pod řádkem. Žádný tooltip na hover – na mobilu nefunguje. Ovládá se Enterem i mezerníkem.
 * Vysvětlení je <span class="block">, takže jde použít i uvnitř odstavce.
 * `name`: celý pojem pro přístupný název tlačítka, když `term` v textu je jen jeho část („aktivní“ → „aktivní fond“).
 * `suffix`: interpunkce za pojmem, aby po rozbalení nezačínal další řádek čárkou.
 */
export function Term({
  term,
  name = term,
  suffix = "",
  children,
}: {
  term: string;
  name?: string;
  suffix?: string;
  children: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      {term}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Co je ${name}?`}
        onClick={() => setOpen(!open)}
        className="press mx-0.5 inline-flex size-6 items-center justify-center rounded-full border border-ink align-middle text-[13px] leading-none font-semibold outline-offset-2 focus-visible:outline-2 aria-expanded:bg-ink aria-expanded:text-paper"
      >
        ?
      </button>
      {suffix}
      <span id={id} hidden={!open} className="fine my-1 block border-l-2 border-rule pl-3">
        {children}
      </span>
    </>
  );
}
