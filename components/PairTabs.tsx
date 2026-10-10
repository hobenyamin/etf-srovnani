"use client";

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";

/**
 * Segmentový přepínač dvojic (WAI-ARIA tabs): šipky ←/→ dokola, Home a End, výběr se přepíná
 * s focusem. Panely jsou karty vykreslené na serveru, tady se jen skrývají.
 */
export function PairTabs({
  label,
  tabs,
  panels,
  initial,
}: {
  label: string;
  tabs: { id: string; label: string }[];
  panels: ReactNode[];
  initial: number;
}) {
  const [selected, setSelected] = useState(initial);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  function select(i: number) {
    setSelected(i);
    refs.current[i]?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (selected === last ? 0 : selected + 1)
      : e.key === "ArrowLeft" ? (selected === 0 ? last : selected - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
  }

  return (
    <>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="grid grid-cols-3 gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${base}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={i === selected}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => select(i)}
            className="num h-11 rounded-sm border border-ink text-[15px] outline-offset-2 focus-visible:outline-2 aria-selected:bg-ink aria-selected:text-paper"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          id={`${base}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${tab.id}`}
          tabIndex={0}
          hidden={i !== selected}
          className="mt-4 outline-offset-4 focus-visible:outline-2"
        >
          {panels[i]}
        </div>
      ))}
    </>
  );
}

