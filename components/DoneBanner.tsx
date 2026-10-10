import type { ReactNode, Ref } from "react";

/**
 * Potvrzení po odeslání (a po potvrzení e-mailu): jediný tmavý blok na stránce, aby bylo hned jasné,
 * že se něco stalo. Razítko je jen ozdoba (aria-hidden), stav nese nadpis. Nadpis přebírá focus (ref),
 * obsah za e-mail je pod blokem na papíře.
 */
export function DoneBanner({
  title,
  stamp = "ODESLÁNO",
  level = 2,
  headingId,
  headingRef,
  children,
}: {
  title: string;
  stamp?: string;
  level?: 1 | 2;
  headingId?: string;
  headingRef: Ref<HTMLHeadingElement>;
  children: ReactNode;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="done-banner rounded-md bg-ink px-5 pt-6 pb-6 text-paper">
      <span aria-hidden className="stamp">
        {stamp}
      </span>
      <Heading
        ref={headingRef}
        tabIndex={-1}
        id={headingId}
        className="mt-4 font-display text-[36px] leading-[40px] font-semibold outline-none"
      >
        {title}
      </Heading>
      <div className="mt-2 text-[15px] leading-6 text-ink-muted">{children}</div>
    </div>
  );
}
