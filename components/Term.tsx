"use client";

import { useId, useState } from "react";

/**
 * Odborný pojem s vysvětlením na klepnutí. Tlačítkem je celý pojem s otazníkem („KID?“), vypadá jako text.
 * Tečkovaně podtržený je jen pojem (odkazy mají plné podtržení), otazník ne. Otevřený stav: pojem
 * i otazník kobaltově. Vysvětlení (jedna věta) se odkryje hned pod řádkem. Žádný tooltip na hover – na mobilu nefunguje. Ovládá se Enterem i mezerníkem.
 * Klepací plochu na 24 px výšky (WCAG 2.5.8) rozšiřuje ::before, text se neposune.
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
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Co je ${name}?`}
        onClick={() => setOpen(!open)}
        className="relative cursor-pointer text-ink outline-offset-2 before:absolute before:-inset-x-1 before:-inset-y-1.5 before:content-[''] focus-visible:rounded-sm focus-visible:outline-2 aria-expanded:text-action"
      >
        <span className="underline decoration-dotted decoration-[1.5px] underline-offset-4">{term}</span>
        <sup aria-hidden className="ml-px text-[0.7em] font-semibold">
          ?
        </sup>
      </button>
      {suffix}
      <span id={id} hidden={!open} className="fine my-1 block border-l-2 border-rule pl-3">
        {children}
      </span>
    </>
  );
}
