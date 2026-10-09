"use client";

import { openConsentSettings } from "@/lib/consent";

/** Odkaz v patičce: znovu otevře lištu souhlasu (odvolání stejně snadné jako udělení). */
export function CookieSettingsButton() {
  return (
    <button type="button" onClick={openConsentSettings} className="underline">
      Nastavení cookies
    </button>
  );
}
