// Měření cesty návštěvníka. Eventy jdou vždy do window.dataLayer (jen paměť stránky, nic se
// neodesílá; háček pro testy, v dev i do konzole) a se souhlasem s měřením i do PostHogu
// (lib/analytics.ts). Varianta reklamy a UTM se berou ze stavu návštěvy (lib/visit.ts).
import { capture } from "@/lib/analytics";
import { type AdVariant, getAdVariant, setAdVariant, utmFromUrl } from "@/lib/visit";

export { type AdVariant, setAdVariant };

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

type DataLayerEntry = Record<string, unknown> & { event: TrackEvent };

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

const fired = new Set<TrackEvent>();

export function track(event: TrackEvent, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const sent = { ad_variant: getAdVariant(), ...utmFromUrl(), ...props };
  const entry: DataLayerEntry = { event, ...sent };
  window.dataLayer ??= [];
  window.dataLayer.push(entry);
  capture(event, sent);
  if (process.env.NODE_ENV !== "production") console.debug("[track]", entry);
}

/** Funnel eventy počítáme jednou za návštěvu stránky. */
export function trackOnce(event: TrackEvent, props?: Record<string, unknown>) {
  if (fired.has(event)) return;
  fired.add(event);
  track(event, props);
}
