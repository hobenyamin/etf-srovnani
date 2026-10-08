"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { type TrackEvent, trackOnce } from "@/lib/track";

/** Odešle event (jednou), když je obsah z poloviny vidět. */
export function TrackView({ event, children }: { event: TrackEvent; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackOnce(event);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [event]);
  return <div ref={ref}>{children}</div>;
}
