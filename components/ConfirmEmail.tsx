"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { confirmLead } from "@/app/actions/lead";
import { DoneBanner } from "@/components/DoneBanner";
import { CONFIRM_VALID_DAYS } from "@/lib/email-template";
import { setAdVariant, track } from "@/lib/track";

type State = "idle" | "working" | "confirmed" | "already" | "expired" | "invalid" | "error";

const button =
  "btn-primary mt-6 h-14 w-full text-base";

/** Potvrzení adresy tlačítkem. Po potvrzení hned plné srovnání a event lead_confirmed s atribucí leadu. */
export function ConfirmEmail({ fullComparison }: { fullComparison: ReactNode }) {
  const token = useSearchParams().get("t");
  const [state, setState] = useState<State>(token ? "idle" : "invalid");
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state !== "idle" && state !== "working") heading.current?.focus();
  }, [state]);

  async function confirm() {
    setState("working");
    const result = await confirmLead(token).catch(() => ({ status: "error" as const }));
    if (result.status === "confirmed") {
      // Atribuce z prvního příchodu (lead), ne z odkazu v e-mailu
      if (result.adVariant) setAdVariant(result.adVariant);
      track("lead_confirmed", { ...(result.adVariant && { ad_variant: result.adVariant }), ...result.utm });
    }
    setState(result.status);
  }

  if (state === "confirmed" || state === "already") {
    return (
      <div data-testid="confirmed" className="mt-4">
        <DoneBanner
          title={state === "confirmed" ? "Hotovo, adresa je potvrzená." : "Adresu už máte potvrzenou."}
          level={1}
          headingRef={heading}
        >
          <p>Tady je plné srovnání všech 5&nbsp;dvojic.</p>
        </DoneBanner>
        <div className="mt-8 space-y-8">{fullComparison}</div>
      </div>
    );
  }

  if (state === "idle" || state === "working") {
    return (
      <>
        <h1 className="mt-4 font-display text-[34px] leading-[38px] font-semibold">Potvrďte svůj e-mail</h1>
        <p className="mt-3 text-[15px] leading-6">Jedním klepnutím potvrdíte adresu a otevře se plné srovnání.</p>
        <button type="button" onClick={confirm} disabled={state === "working"} className={button}>
          {state === "working" ? (
            <>
              <span aria-hidden className="pulse-dot mr-2" />
              Potvrzuji…
            </>
          ) : (
            "Potvrdit e-mail"
          )}
        </button>
      </>
    );
  }

  const message = {
    expired: {
      title: "Odkaz už vypršel",
      text: `Odkaz z e-mailu platí ${CONFIRM_VALID_DAYS} dní. Zadejte e-mail znovu a pošleme vám nový.`,
    },
    invalid: {
      title: "Tenhle odkaz nefunguje",
      text: "Možná není celý, nebo jsme vám mezitím poslali novější e-mail – použijte odkaz z posledního. Případně e-mail zadejte znovu.",
    },
    error: {
      title: "Teď se to nepovedlo",
      text: "Na naší straně je chyba. Zkuste to prosím za chvíli znovu.",
    },
  }[state];

  return (
    <div role="alert">
      <h1 ref={heading} tabIndex={-1} className="mt-4 font-display text-[34px] leading-[38px] font-semibold outline-none">
        {message.title}
      </h1>
      <p className="mt-3 text-[15px] leading-6">{message.text}</p>
      {state === "error" ? (
        <button type="button" onClick={confirm} className={button}>
          Zkusit znovu
        </button>
      ) : (
        <Link href="/#formular" className={button}>
          Zadat e-mail znovu
        </Link>
      )}
    </div>
  );
}
