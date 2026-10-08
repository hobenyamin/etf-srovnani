"use client";

import type { ComponentProps } from "react";
import { type TrackEvent, track } from "@/lib/track";

/** Kotva, která při kliknutí odešle event. */
export function TrackedLink({
  event,
  eventProps,
  ...props
}: ComponentProps<"a"> & { event: TrackEvent; eventProps?: Record<string, unknown> }) {
  return <a {...props} onClick={() => track(event, eventProps)} />;
}
