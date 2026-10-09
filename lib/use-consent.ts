"use client";

import { useSyncExternalStore } from "react";
import { getConsentSnapshot, getServerConsentSnapshot, subscribeConsent } from "@/lib/consent";

export function useConsent() {
  return useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsentSnapshot);
}

/** Lišta je vidět, dokud návštěvník nevolil, nebo když si otevřel nastavení. */
export function useBannerVisible(): boolean {
  const s = useConsent();
  return s.status === "pending" || (s.status === "decided" && s.settingsOpen);
}
