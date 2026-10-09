"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { unsubscribeLead } from "@/app/actions/lead";
import { OPERATOR } from "@/lib/site";

type State = "idle" | "working" | "done" | "failed";

/** Odhlášení tlačítkem (odkaz sám nic nemění – skenery odkazů nikoho neodhlásí). */
export function Unsubscribe() {
  const signed = useSearchParams().get("u");
  const [state, setState] = useState<State>(signed ? "idle" : "failed");

  async function unsubscribe() {
    setState("working");
    const ok = await unsubscribeLead(signed).catch(() => false);
    setState(ok ? "done" : "failed");
  }

  if (state === "done") {
    return (
      <div role="status" data-testid="unsubscribed">
        <h1 className="mt-4 font-display text-[34px] leading-[38px] font-semibold">Hotovo, jste odhlášeni.</h1>
        <p className="mt-3 text-[15px] leading-6">
          Další e-maily vám nepošleme. Pokud znovu vyplníte formulář na stránce, pošleme jen srovnání, o které požádáte.
        </p>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div role="alert">
        <h1 className="mt-4 font-display text-[34px] leading-[38px] font-semibold">Odhlášení se nepovedlo</h1>
        <p className="mt-3 text-[15px] leading-6">
          Odkaz je neúplný nebo neplatný. Napište nám na{" "}
          <a href={`mailto:${OPERATOR.email}?subject=Odhl%C3%A1sit`} className="underline">
            {OPERATOR.email}
          </a>{" "}
          a odhlásíme vás ručně.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mt-4 font-display text-[34px] leading-[38px] font-semibold">Odhlásit se z e-mailů</h1>
      <p className="mt-3 text-[15px] leading-6">Po odhlášení vám už nepošleme žádné další e-maily.</p>
      <button
        type="button"
        onClick={unsubscribe}
        disabled={state === "working"}
        className="mt-6 flex h-14 w-full items-center justify-center rounded-sm bg-ink text-base font-semibold text-paper outline-offset-4 focus-visible:outline-2 focus-visible:outline-ink disabled:opacity-60"
      >
        {state === "working" ? "Odhlašuji…" : "Odhlásit se"}
      </button>
    </>
  );
}
