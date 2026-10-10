"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Plynulý přechod čísla na novou hodnotu (ease-out). Při načtení se neanimuje, začíná rovnou na cíli.
 * S prefers-reduced-motion skočí na cíl v prvním snímku.
 */
export function useTween(target: number, duration = 300): number {
  const [value, setValue] = useState(target);
  const shown = useRef(target);

  useEffect(() => {
    const from = shown.current;
    if (from === target) return;
    const length = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = length ? Math.min((now - start) / length, 1) : 1;
      const next = t === 1 ? target : from + (target - from) * (1 - (1 - t) ** 3);
      shown.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
