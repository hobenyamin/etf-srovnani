import type { ReactNode } from "react";

/**
 * Rozbalovací pole pro vedlejší text (zdroje, metodika). Nativní <details>/<summary>: ovládá se
 * klávesnicí (Enter, mezerník) a čtečka ho oznámí jako rozbalovací. Rizikové upozornění a podmínky
 * u čísel sem nepatří, ty jsou vidět vždy.
 */
export function More({ summary, children, className = "" }: { summary: string; children: ReactNode; className?: string }) {
  return (
    <details className={`group fine ${className}`}>
      {/* summary zůstává display: list-item (Safari jinak ztrácí roli), šipka je vlastní */}
      <summary className="cursor-pointer list-none py-2.5 font-semibold text-ink outline-offset-2 focus-visible:outline-2 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2 underline decoration-rule underline-offset-4">
          <svg aria-hidden viewBox="0 0 8 10" className="size-2.5 shrink-0 fill-current motion-safe:transition-transform group-open:rotate-90">
            <path d="M0 0 8 5 0 10z" />
          </svg>
          {summary}
        </span>
      </summary>
      <div className="pb-2">{children}</div>
    </details>
  );
}
