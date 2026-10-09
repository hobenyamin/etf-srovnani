import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clampInput, LIMITS } from "./calc";
import { FEE_ROWS } from "./fee-rows";
import { computeFees } from "./fees";
import { MIN_FILL_MS, parseLeadInput } from "./lead";
import { buildLeadParams, handleQualify, handleSubmit, type LeadStore, type UpsertLeadParams } from "./lead-server";
import { createRateLimiter } from "./rate-limit";
import { sign, verify } from "./sign";
import { CONSENT } from "./site";

const human = {
  email: " Jan.Novak@Seznam.cz ",
  marketing: false,
  adVariant: "a",
  utm: { utm_source: "meta", utm_content: "a-uspora" },
  calcInput: { initial: 0, monthly: 3000, years: 20, annualReturn: 5 },
  website: "",
  elapsedMs: 15_000,
};

export function fakeStore(overrides: Partial<LeadStore> = {}) {
  const calls: UpsertLeadParams[] = [];
  const store: LeadStore = {
    upsert: vi.fn(async (params: UpsertLeadParams) => {
      calls.push(params);
      return { id: "11111111-2222-3333-4444-555555555555", isNew: true, doubleOptInAt: null, confirmSentAt: null };
    }),
    setQualify: vi.fn(async () => {}),
    claimConfirmation: vi.fn(async () => true),
    confirm: vi.fn(async () => ({ status: "invalid" as const, adVariant: null, utm: {} })),
    unsubscribe: vi.fn(async () => true),
    ...overrides,
  };
  return { store, calls };
}

const ctx = (store: LeadStore | null) => ({ store, ip: "203.0.113.7", userAgent: "Mozilla/5.0 Test", limiter: { hit: () => true } });

beforeEach(() => {
  vi.stubEnv("LEAD_TOKEN_SECRET", "test-secret");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("parseLeadInput", () => {
  it("normalizuje e-mail a odmítne neplatný", () => {
    const ok = parseLeadInput(human);
    expect(ok.ok && ok.lead.email).toBe("jan.novak@seznam.cz");
    expect(parseLeadInput({ ...human, email: "jan@seznam" })).toEqual({ ok: false, error: "email" });
    expect(parseLeadInput({ ...human, email: `${"a".repeat(250)}@x.cz` })).toEqual({ ok: false, error: "email" });
    expect(parseLeadInput(null)).toEqual({ ok: false, error: "invalid" });
    expect(parseLeadInput({ ...human, email: 42 })).toEqual({ ok: false, error: "invalid" });
  });

  it("propustí jen 4 UTM klíče a ořízne délku", () => {
    const r = parseLeadInput({ ...human, utm: { utm_source: "x".repeat(500), utm_term: "cizí", gclid: "abc" } });
    expect(r.ok && r.lead.utm).toEqual({ utm_source: "x".repeat(200) });
  });

  it("neznámá varianta → a, marketing jen při true", () => {
    const r = parseLeadInput({ ...human, adVariant: "<script>", marketing: "yes" });
    expect(r.ok && r.lead.adVariant).toBe("a");
    expect(r.ok && r.lead.marketing).toBe(false);
  });

  it("vstup kalkulačky ořízne na povolené rozsahy, nečísla → minimum", () => {
    const r = parseLeadInput({ ...human, calcInput: { initial: 1e12, monthly: "5000", years: 99, annualReturn: -3 } });
    expect(r.ok && r.lead.calcInput).toEqual({
      initial: LIMITS.initial.max,
      monthly: LIMITS.monthly.min,
      years: LIMITS.years.max,
      annualReturn: LIMITS.annualReturn.min,
    });
    const none = parseLeadInput({ ...human, calcInput: null });
    expect(none.ok && none.lead.calcInput).toBeNull();
  });

  it("honeypot nebo rychlé odeslání = robot", () => {
    expect(parseLeadInput({ ...human, website: "https://spam.example" })).toMatchObject({ ok: true, bot: true });
    expect(parseLeadInput({ ...human, elapsedMs: MIN_FILL_MS - 1 })).toMatchObject({ ok: true, bot: true });
    expect(parseLeadInput({ ...human, elapsedMs: undefined })).toMatchObject({ ok: true, bot: true });
    expect(parseLeadInput(human)).toMatchObject({ ok: true, bot: false });
  });
});

describe("buildLeadParams", () => {
  it("výsledek kalkulačky přepočítá server, ne prohlížeč", () => {
    const r = parseLeadInput(human);
    if (!r.ok) throw new Error();
    const params = buildLeadParams(r.lead, "UA");
    const expected = computeFees(clampInput(human.calcInput), FEE_ROWS);
    expect(params.p_calc_result?.esma_gap).toBe(Math.round(expected.esmaGap));
    expect(params.p_calc_result?.rows).toHaveLength(FEE_ROWS.length);
  });

  it("znění souhlasu jen se zaškrtnutím; informace u formuláře vždy", () => {
    const without = parseLeadInput(human);
    const withConsent = parseLeadInput({ ...human, marketing: true });
    if (!without.ok || !withConsent.ok) throw new Error();
    expect(buildLeadParams(without.lead, null)).toMatchObject({ p_marketing_consent: false, p_consent_text: null });
    expect(buildLeadParams(withConsent.lead, null)).toMatchObject({
      p_marketing_consent: true,
      p_consent_text: CONSENT.marketing,
    });
    expect(buildLeadParams(without.lead, null).p_notice_text).toBe(CONSENT.notice);
  });
});

describe("handleSubmit", () => {
  it("uloží lead a vrátí podepsaný ref; IP se do databáze nedostane", async () => {
    const { store, calls } = fakeStore();
    const result = await handleSubmit(human, ctx(store));
    expect(result).toMatchObject({ ok: true, stored: true });
    expect(result.ok && verify(result.ref)).toBe("11111111-2222-3333-4444-555555555555");
    expect(calls).toHaveLength(1);
    expect(JSON.stringify(calls[0])).not.toContain("203.0.113.7");
    expect(calls[0]).toMatchObject({ p_email: "jan.novak@seznam.cz", p_utm_source: "meta", p_ad_variant: "a", p_user_agent: "Mozilla/5.0 Test" });
  });

  it("robot dostane stejnou odpověď jako člověk, nic se neuloží", async () => {
    const { store, calls } = fakeStore();
    expect(await handleSubmit({ ...human, website: "x" }, ctx(store))).toEqual({ ok: true, stored: true, ref: null });
    expect(await handleSubmit({ ...human, elapsedMs: 300 }, ctx(store))).toEqual({ ok: true, stored: true, ref: null });
    expect(calls).toHaveLength(0);
  });

  it("nedostupná databáze → stored:false, bez výjimky a bez e-mailu v logu", async () => {
    const { store } = fakeStore({ upsert: vi.fn().mockRejectedValue(new TypeError("fetch failed")) });
    const result = await handleSubmit(human, ctx(store));
    expect(result).toEqual({ ok: true, stored: false, ref: null });
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls);
    expect(logged).not.toContain("seznam.cz");
  });

  it("chybějící konfigurace Supabase → stored:false", async () => {
    expect(await handleSubmit(human, ctx(null))).toEqual({ ok: true, stored: false, ref: null });
  });

  it("neplatný e-mail se neuloží", async () => {
    const { store, calls } = fakeStore();
    expect(await handleSubmit({ ...human, email: "nic" }, ctx(store))).toEqual({ ok: false, error: "email" });
    expect(calls).toHaveLength(0);
  });

  it("překročený limit IP → neuloží", async () => {
    const { store, calls } = fakeStore();
    const result = await handleSubmit(human, { ...ctx(store), limiter: { hit: () => false } });
    expect(result).toEqual({ ok: true, stored: false, ref: null });
    expect(calls).toHaveLength(0);
  });
});

describe("handleQualify", () => {
  it("uloží jen platnou odpověď s pravým podpisem", async () => {
    const { store } = fakeStore();
    const id = "11111111-2222-3333-4444-555555555555";
    const ref = sign(id)!;
    expect(await handleQualify(ref, "ano", store)).toBe(true);
    expect(store.setQualify).toHaveBeenCalledWith(id, "ano");
    expect(await handleQualify(sign("unsub:" + id), "ano", store)).toBe(false);
    expect(await handleQualify(ref, "možná", store)).toBe(false);
    expect(await handleQualify(id + ".podvrh", "ano", store)).toBe(false);
    expect(await handleQualify(sign("jiny-lead", "cizi-tajemstvi"), "ano", store)).toBe(false);
  });
});

describe("sign / verify", () => {
  it("bez tajemství nic nepodepíše", () => {
    vi.stubEnv("LEAD_TOKEN_SECRET", "");
    expect(sign("x")).toBeNull();
    expect(verify("x.abc")).toBeNull();
  });

  it("změněná hodnota neprojde", () => {
    const signed = sign("abc")!;
    expect(verify(signed)).toBe("abc");
    expect(verify(signed.replace("abc", "abd"))).toBeNull();
  });
});

describe("createRateLimiter", () => {
  it("6. pokus v okně odmítne, po uplynutí okna zase pustí", () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: 1000 });
    for (let i = 0; i < 5; i++) expect(limiter.hit("ip", i)).toBe(true);
    expect(limiter.hit("ip", 10)).toBe(false);
    expect(limiter.hit("jina-ip", 10)).toBe(true);
    expect(limiter.hit("ip", 2000)).toBe(true);
  });
});
