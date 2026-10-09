import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const posthog = { init: vi.fn(), capture: vi.fn(), reset: vi.fn(), set_config: vi.fn() };
vi.mock("posthog-js", () => ({ default: posthog }));

type DataLayer = Record<string, unknown>[];

function stubBrowser(search = "?utm_source=meta&utm_content=a-uspora") {
  const ls = new Map<string, string>([
    ["consent.v1", "{}"],
    ["ph_phc_test_posthog", "{}"],
  ]);
  const storage = (m: Map<string, string>) =>
    new Proxy(
      { removeItem: (k: string) => void m.delete(k) },
      { ownKeys: () => [...m.keys()], getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }) },
    );
  const cookies: string[] = [];
  vi.stubGlobal("window", {
    location: { search, hostname: "srovnani.example.cz" },
    localStorage: storage(ls),
    sessionStorage: storage(new Map()),
    dataLayer: [] as DataLayer,
  });
  vi.stubGlobal("document", {
    get cookie() {
      return "ph_phc_test_posthog=abc; other=1";
    },
    set cookie(v: string) {
      cookies.push(v);
    },
  });
  return { ls, cookies };
}

async function load() {
  vi.resetModules();
  const analytics = await import("./analytics");
  const track = await import("./track");
  return { ...analytics, ...track };
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com");
  for (const fn of Object.values(posthog)) fn.mockClear();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("track + PostHog", () => {
  it("bez souhlasu: PostHog se nenačte ani nevolá, dataLayer dál funguje", async () => {
    stubBrowser();
    const { track } = await load();
    track("page_view");
    track("calc_start");
    expect(posthog.init).not.toHaveBeenCalled();
    expect(posthog.capture).not.toHaveBeenCalled();
    expect((window as unknown as { dataLayer: DataLayer }).dataLayer.map((e) => e.event)).toEqual(["page_view", "calc_start"]);
  });

  it("po souhlasu: EU host, nic automaticky, page_view hned a další eventy s ad_variant a UTM", async () => {
    stubBrowser();
    const { track, startAnalytics, setAdVariant } = await load();
    setAdVariant("b");
    track("page_view");
    track("calc_start"); // před souhlasem – nepošle se ani dodatečně
    await startAnalytics();

    const [key, config] = posthog.init.mock.calls[0];
    expect(key).toBe("phc_test");
    expect(config).toMatchObject({
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      disable_external_dependency_loading: true,
      person_profiles: "identified_only",
    });
    expect(posthog.capture.mock.calls).toEqual([
      ["page_view", { ad_variant: "b", utm_source: "meta", utm_content: "a-uspora" }],
    ]);

    track("form_submit", { marketing_consent: true });
    expect(posthog.capture).toHaveBeenLastCalledWith("form_submit", {
      ad_variant: "b",
      utm_source: "meta",
      utm_content: "a-uspora",
      marketing_consent: true,
    });
  });

  it("odvolání: dál nic neposílá a smaže ph_ z úložiště i cookies (consent.v1 zůstane)", async () => {
    const { ls, cookies } = stubBrowser();
    const { track, startAnalytics, stopAnalytics } = await load();
    await startAnalytics();
    stopAnalytics();
    posthog.capture.mockClear();
    track("calc_start");
    expect(posthog.capture).not.toHaveBeenCalled();
    expect(posthog.reset).toHaveBeenCalled();
    expect([...ls.keys()]).toEqual(["consent.v1"]);
    expect(cookies.some((c) => c.startsWith("ph_phc_test_posthog=; Max-Age=0"))).toBe(true);
    expect(cookies.some((c) => c.startsWith("other="))).toBe(false);
  });

  it("bez klíče PostHogu se nic nenačte", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    stubBrowser();
    const { startAnalytics, track } = await load();
    await startAnalytics();
    track("page_view");
    expect(posthog.init).not.toHaveBeenCalled();
  });
});

describe("stripSecrets", () => {
  it("token z potvrzovacího odkazu a podpis odhlášení se do PostHogu nedostanou", async () => {
    const { stripSecrets } = await import("./analytics");
    const cr = stripSecrets({
      uuid: "1",
      event: "lead_confirmed",
      properties: {
        $current_url: "https://srovnani.example/potvrzeni?t=SECRETTOKEN&utm_source=meta",
        $referrer: "https://srovnani.example/odhlaseni?u=unsub:abc.SIG#x",
        ad_variant: "a",
      },
      $set_once: { $initial_current_url: "https://srovnani.example/potvrzeni?x=1&t=SECRETTOKEN" },
    });
    const json = JSON.stringify(cr);
    expect(json).not.toContain("SECRETTOKEN");
    expect(json).not.toContain("SIG");
    expect(cr!.properties.$current_url).toBe("https://srovnani.example/potvrzeni?t=[skryto]&utm_source=meta");
    expect(cr!.properties.ad_variant).toBe("a");
    expect(stripSecrets(null)).toBeNull();
  });
});
