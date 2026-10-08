"use client";

import { useEffect } from "react";
import { type AdVariant, setAdVariant, trackOnce } from "@/lib/track";

/** Nastaví variantu reklamy pro všechny eventy a odešle page_view. */
export function PageView({ variant }: { variant: AdVariant }) {
  useEffect(() => {
    setAdVariant(variant);
    trackOnce("page_view");
  }, [variant]);
  return null;
}
