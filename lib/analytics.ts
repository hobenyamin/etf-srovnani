// PostHog (EU Cloud) – jen se souhlasem s měřením. Knihovna se stáhne dynamickým importem až po
// souhlasu, takže bez něj se nic nenačte, neodešle ani neuloží. Eventy z doby před souhlasem se
// neposílají dodatečně; výjimkou je page_view aktuální stránky (skutečnost, že návštěvník stránku
// právě vidí), aby funnel v PostHogu začínal prvním krokem.
//
// Reklamní pixely (Meta Pixel + CAPI, Google Ads s Consent Mode v2) sem patří až po schválení,
// za samostatnou kategorií souhlasu `ads` (lib/consent.ts). Zatím záměrně nic.
import type { CaptureResult, PostHog, Properties } from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
/** Eventy jdou přes vlastní doménu, server je přepošle do PostHog EU (next.config.ts, rewrites). */
export const ANALYTICS_PATH = "/ingest";
/** Platnost cookie PostHogu (výchozí 365 dní – na měření kampaně zbytečně dlouho). Uvedeno v zásadách. */
export const ANALYTICS_COOKIE_DAYS = 180;

/** Tajné parametry v odkazech z e-mailu: t = potvrzovací token, u = podpis odhlášení. */
const SECRET_PARAMS = /([?&])(t|u)=[^&#]*/g;

/** PostHog přikládá adresu stránky ($current_url, $referrer…). Tokeny z e-mailu do něj nesmí. */
export function stripSecrets(cr: CaptureResult | null): CaptureResult | null {
  if (!cr) return cr;
  const clean = (props?: Properties) => {
    if (!props) return props;
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === "string" && value.includes("=")) props[key] = value.replace(SECRET_PARAMS, "$1$2=[skryto]");
    }
    return props;
  };
  clean(cr.properties);
  clean(cr.$set);
  clean(cr.$set_once);
  return cr;
}

let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
let active = false;

async function load(): Promise<PostHog | null> {
  if (!KEY) return null;
  const { default: posthog } = await import("posthog-js");
  posthog.init(KEY, {
    api_host: ANALYTICS_PATH,
    // odkazy z knihovny do aplikace PostHog (při proxy ji jinak neodvodí)
    ui_host: "https://eu.posthog.com",
    persistence: "localStorage+cookie",
    cookie_expiration: ANALYTICS_COOKIE_DAYS,
    cross_subdomain_cookie: false,
    // Měříme jen vlastní eventy funnelu (lib/track.ts), nic automaticky
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    rageclick: false,
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_heatmaps: false,
    capture_performance: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_product_tours: true,
    disable_conversations: true,
    disable_web_experiments: true,
    // Žádné další skripty z PostHogu a žádné feature flagy
    disable_external_dependency_loading: true,
    advanced_disable_flags: true,
    // Bez identify(): žádné osobní profily, e-mail se do PostHogu nikdy nedostane
    person_profiles: "identified_only",
    // Každý event hned (je jich jen pár za návštěvu): po odvolání souhlasu nic nečeká ve frontě
    // a na mobilu se eventy neztratí při zavření karty
    request_batching: false,
    before_send: stripSecrets,
  });
  return posthog;
}

function pageViewFromDataLayer(): Record<string, unknown> | null {
  const entry = window.dataLayer?.find((e) => e.event === "page_view");
  if (!entry) return null;
  return Object.fromEntries(Object.entries(entry).filter(([key]) => key !== "event"));
}

/** Souhlas udělen: načíst PostHog (jednou) a začít posílat. */
export async function startAnalytics(): Promise<void> {
  if (typeof window === "undefined" || active) return;
  active = true;
  loading ??= load();
  client = await loading;
  if (!client || !active) return;
  client.set_config({ disable_persistence: false });
  const pageView = pageViewFromDataLayer();
  if (pageView) client.capture("page_view", pageView);
}

/** Souhlas odvolán: přestat posílat a smazat vše, co PostHog v prohlížeči uložil. */
export function stopAnalytics(): void {
  if (typeof window === "undefined") return;
  active = false;
  if (client) {
    client.reset();
    client.set_config({ disable_persistence: true });
  }
  clearPostHogStorage();
}

export function clearPostHogStorage(): void {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith("ph_") || key.startsWith("__ph")) window.localStorage.removeItem(key);
    }
    for (const key of Object.keys(window.sessionStorage)) {
      if (key.startsWith("ph_") || key.startsWith("__ph")) window.sessionStorage.removeItem(key);
    }
  } catch {
    // úložiště nedostupné – není co mazat
  }
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("ph_")) continue;
    const expire = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = expire;
    // PostHog může cookie nastavit na nadřazenou doménu (cross_subdomain_cookie)
    const parts = window.location.hostname.split(".");
    for (let i = 0; i < parts.length - 1; i++) {
      document.cookie = `${expire}; domain=.${parts.slice(i).join(".")}`;
    }
  }
}

/** Volá track() u každého eventu. Bez souhlasu (active = false) nic. */
export function capture(event: string, props: Record<string, unknown>): void {
  if (active && client) client.capture(event, props);
}
