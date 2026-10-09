import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_KEY,
  CONSENT_VERSION,
  getConsentSnapshot,
  hasAnalyticsConsent,
  openConsentSettings,
  parseConsent,
  resetConsentForTests,
  saveConsent,
  subscribeConsent,
} from "./consent";

function storage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    data,
  };
}

beforeEach(() => resetConsentForTests());
afterEach(() => vi.unstubAllGlobals());

describe("parseConsent", () => {
  it("poškozená, cizí nebo stará verze → žádný souhlas (zeptat se znovu)", () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent("{")).toBeNull();
    expect(parseConsent('"ano"')).toBeNull();
    expect(parseConsent(JSON.stringify({ version: CONSENT_VERSION - 1, analytics: true, at: "x" }))).toBeNull();
    expect(parseConsent(JSON.stringify({ version: CONSENT_VERSION, analytics: "true", at: "x" }))).toBeNull();
  });

  it("platná volba projde, ads jen při true", () => {
    const raw = JSON.stringify({ version: CONSENT_VERSION, analytics: true, ads: "yes", at: "2026-10-09T00:00:00.000Z" });
    expect(parseConsent(raw)).toEqual({ version: CONSENT_VERSION, analytics: true, ads: false, at: "2026-10-09T00:00:00.000Z" });
  });
});

describe("stav souhlasu", () => {
  it("na serveru unknown (lišta se nevykreslí, žádný hydratační rozdíl)", () => {
    expect(getConsentSnapshot().status).toBe("unknown");
  });

  it("bez uložené volby pending, bez souhlasu s měřením", () => {
    vi.stubGlobal("window", { localStorage: storage() });
    expect(getConsentSnapshot().status).toBe("pending");
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("uložení volby: zapíše jen volbu (bez ads), oznámí změnu, zavře lištu", () => {
    const ls = storage();
    vi.stubGlobal("window", { localStorage: ls });
    const listener = vi.fn();
    subscribeConsent(listener);
    saveConsent({ analytics: true }, new Date("2026-10-09T10:00:00Z"));
    expect(listener).toHaveBeenCalledTimes(1);
    expect([...ls.data.keys()]).toEqual([CONSENT_KEY]);
    expect(JSON.parse(ls.data.get(CONSENT_KEY)!)).toEqual({
      version: CONSENT_VERSION,
      analytics: true,
      ads: false,
      at: "2026-10-09T10:00:00.000Z",
    });
    expect(hasAnalyticsConsent()).toBe(true);
    expect(getConsentSnapshot()).toMatchObject({ status: "decided", settingsOpen: false });
  });

  it("odmítnutí → bez souhlasu; nastavení z patičky lištu znovu otevře", () => {
    vi.stubGlobal("window", { localStorage: storage() });
    saveConsent({ analytics: false });
    expect(hasAnalyticsConsent()).toBe(false);
    openConsentSettings();
    expect(getConsentSnapshot()).toMatchObject({ status: "decided", settingsOpen: true });
  });

  it("zakázané úložiště (výjimka) = bez souhlasu, volba platí aspoň v paměti", () => {
    const blocked = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    };
    vi.stubGlobal("window", { localStorage: blocked });
    expect(getConsentSnapshot().status).toBe("pending");
    saveConsent({ analytics: true });
    expect(hasAnalyticsConsent()).toBe(true);
  });
});
