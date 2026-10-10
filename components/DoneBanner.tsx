import type { ReactNode, Ref } from "react";

/**
 * Potvrzení po odeslání (a po potvrzení e-mailu): jediný tmavý blok na stránce, aby bylo hned jasné,
 * že se něco stalo. Nadpis přebírá focus (ref), obsah za e-mail je pod blokem na papíře.
 */
export function DoneBanner({
  title,
  level = 2,
  headingId,
  headingRef,
  children,
}: {
  title: string;
  level?: 1 | 2;
  headingId?: string;
  headingRef: Ref<HTMLHeadingElement>;
  children: ReactNode;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="done-banner rounded-md bg-ink px-5 pt-5 pb-6 text-paper">
      <svg aria-hidden viewBox="0 0 40 40" className="done-icon size-10" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="20" cy="20" r="18" />
        <path d="m12 20.5 5.5 5.5L28.5 15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Heading
        ref={headingRef}
        tabIndex={-1}
        id={headingId}
        className="mt-3 font-display text-[36px] leading-[40px] font-semibold outline-none"
      >
        {title}
      </Heading>
      <div className="mt-2 text-[15px] leading-6 text-ink-muted">{children}</div>
    </div>
  );
}
