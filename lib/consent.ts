// Souhlas s cookies (127/2005 § 89 odst. 3). Volba se ukládá do localStorage – uložení volby je
// technicky nezbytné. Bez souhlasu se nic neodesílá ani neukládá (viz README, Rozhodnutí).
// Kategorie `ads` je připravená pro reklamní pixely, v liště se zatím nenabízí – žádné pixely nejsou.

export const CONSENT_KEY = "consent.v1";
/** Zvýšení verze (nová kategorie, nový zpracovatel) = zeptat se znovu. */
export const CONSENT_VERSION = 1;

export type Consent = { version: number; analytics: boolean; ads: boolean; at: string };

/** unknown = server / před hydratací (lištu nevykreslovat), pending = návštěvník ještě nevolil */
export type ConsentSnapshot =
  | { status: "unknown"; consent: null; settingsOpen: false }
  | { status: "pending"; consent: null; settingsOpen: boolean }
  | { status: "decided"; consent: Consent; settingsOpen: boolean };

const SERVER_SNAPSHOT: ConsentSnapshot = { status: "unknown", consent: null, settingsOpen: false };

export function parseConsent(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Consent>;
    if (value.version !== CONSENT_VERSION || typeof value.analytics !== "boolean" || typeof value.at !== "string") {
      return null;
    }
    return { version: CONSENT_VERSION, analytics: value.analytics, ads: value.ads === true, at: value.at };
  } catch {
    return null;
  }
}

function readStorage(): Consent | null {
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_KEY));
  } catch {
    return null; // zakázané úložiště → chová se jako bez souhlasu
  }
}

let snapshot: ConsentSnapshot | null = null;
const listeners = new Set<() => void>();

function emit(next: ConsentSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

export function getConsentSnapshot(): ConsentSnapshot {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  if (!snapshot) {
    const consent = readStorage();
    snapshot = consent
      ? { status: "decided", consent, settingsOpen: false }
      : { status: "pending", consent: null, settingsOpen: false };
  }
  return snapshot;
}

export function getServerConsentSnapshot(): ConsentSnapshot {
  return SERVER_SNAPSHOT;
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function hasAnalyticsConsent(): boolean {
  const s = getConsentSnapshot();
  return s.status === "decided" && s.consent.analytics;
}

export function saveConsent({ analytics }: { analytics: boolean }, now = new Date()) {
  const consent: Consent = { version: CONSENT_VERSION, analytics, ads: false, at: now.toISOString() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Bez úložiště platí volba jen do zavření stránky
  }
  emit({ status: "decided", consent, settingsOpen: false });
}

/** Odkaz „Nastavení cookies“ v patičce – znovu otevře lištu. */
export function openConsentSettings() {
  const current = getConsentSnapshot();
  if (current.status === "unknown") return;
  emit({ ...current, settingsOpen: true });
}

/** Jen pro testy. */
export function resetConsentForTests() {
  snapshot = null;
  listeners.clear();
}
