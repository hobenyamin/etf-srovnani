// Měření cesty návštěvníka. Krok 3: jen zástupná vrstva – eventy jdou do window.dataLayer
// (a v dev do konzole). Napojení na PostHog a režim bez cookies je krok 4.

export const FUNNEL_EVENTS = [
  "page_view",
  "hero_cta_click",
  "calc_start",
  "calc_result",
  "compare_view",
  "form_view",
  "form_submit",
  "lead_confirmed",
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];
export type TrackEvent = FunnelEvent | "qualify_answer";
export type AdVariant = "a" | "b";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

type DataLayerEntry = Record<string, unknown> & { event: TrackEvent };

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

let adVariant: AdVariant = "a";
const fired = new Set<TrackEvent>();

export function setAdVariant(variant: AdVariant) {
  adVariant = variant;
}

function utm(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}

export function track(event: TrackEvent, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const entry: DataLayerEntry = { event, ad_variant: adVariant, ...utm(), ...props };
  window.dataLayer ??= [];
  window.dataLayer.push(entry);
  if (process.env.NODE_ENV !== "production") console.debug("[track]", entry);
}

/** Funnel eventy počítáme jednou za návštěvu stránky. */
export function trackOnce(event: TrackEvent, props?: Record<string, unknown>) {
  if (fired.has(event)) return;
  fired.add(event);
  track(event, props);
}
