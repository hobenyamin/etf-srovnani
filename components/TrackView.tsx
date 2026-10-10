"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { type TrackEvent, trackOnce } from "@/lib/track";

/** Odešle event (jednou), když je obsah z poloviny vidět. */
export function TrackView({
  event,
  props,
  children,
}: {
  event: TrackEvent;
  props?: Record<string, unknown>;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackOnce(event, propsRef.current);
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
