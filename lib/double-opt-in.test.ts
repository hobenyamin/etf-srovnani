import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mailer, OutgoingEmail } from "./email";
import { confirmationEmail } from "./email-template";
import { formatDate } from "./format";
import {
  handleConfirm,
  handleSubmit,
  handleUnsubscribe,
  hashToken,
  type LeadStore,
  sendConfirmation,
  signUnsubscribe,
} from "./lead-server";
import { sign } from "./sign";
import { OPERATOR, RISK_WARNINGS } from "./site";

const ID = "11111111-2222-3333-4444-555555555555";
const SITE = "https://srovnani.example";

function store(overrides: Partial<LeadStore> = {}): LeadStore {
  return {
    upsert: vi.fn(async () => ({ id: ID, isNew: true, doubleOptInAt: null, confirmSentAt: null })),
    setQualify: vi.fn(async () => {}),
    claimConfirmation: vi.fn(async () => true),
    confirm: vi.fn(async () => ({ status: "confirmed" as const, adVariant: "b" as const, utm: { utm_source: "meta" } })),
    unsubscribe: vi.fn(async () => true),
    ...overrides,
  };
}

function mailer() {
  const sent: OutgoingEmail[] = [];
  const m: Mailer = { send: vi.fn(async (e: OutgoingEmail) => void sent.push(e)) };
  return { mailer: m, sent };
}

const human = {
  email: "jan@example.com",
  marketing: false,
  adVariant: "a",
  utm: {},
  calcInput: null,
  website: "",
  elapsedMs: 10_000,
};

beforeEach(() => {
  vi.stubEnv("LEAD_TOKEN_SECRET", "test-secret");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("sendConfirmation", () => {
  it("do DB jde jen hash tokenu z odkazu, e-mail má odhlášení a one-click hlavičky", async () => {
    const s = store();
    const { mailer: m, sent } = mailer();
    await sendConfirmation(ID, "jan@example.com", { store: s, mailer: m, siteUrl: SITE });

    expect(sent).toHaveLength(1);
    const email = sent[0];
    const token = email.text.match(/\/potvrzeni\?t=([A-Za-z0-9_-]+)/)![1];
    const [claimedId, storedHash] = vi.mocked(s.claimConfirmation).mock.calls[0];
    expect(claimedId).toBe(ID);
    expect(storedHash).toBe(hashToken(token));
    expect(storedHash).not.toContain(token);
    expect(email.to).toBe("jan@example.com");
    expect(email.headers?.["List-Unsubscribe"]).toContain(`${SITE}/api/odhlaseni?u=`);
    expect(email.headers?.["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(email.idempotencyKey).toMatch(/^confirm-[0-9a-f]+$/);
  });

  it("cooldown nebo strop (claim = false) → e-mail neodejde", async () => {
    const { mailer: m, sent } = mailer();
    await sendConfirmation(ID, "jan@example.com", { store: store({ claimConfirmation: vi.fn(async () => false) }), mailer: m, siteUrl: SITE });
    expect(sent).toHaveLength(0);
  });

  it("bez konfigurace Resend / SITE_URL / tajemství nic nezabere ani neodešle", async () => {
    const s = store();
    await sendConfirmation(ID, "jan@example.com", { store: s, mailer: null, siteUrl: SITE });
    await sendConfirmation(ID, "jan@example.com", { store: s, mailer: mailer().mailer, siteUrl: null });
    vi.stubEnv("LEAD_TOKEN_SECRET", "");
    await sendConfirmation(ID, "jan@example.com", { store: s, mailer: mailer().mailer, siteUrl: SITE });
    expect(s.claimConfirmation).not.toHaveBeenCalled();
  });

  it("chyba Resend nevyhodí výjimku a neloguje e-mail", async () => {
    const failing: Mailer = { send: vi.fn().mockRejectedValue({ name: "validation_error", message: "Invalid `to` field" }) };
    await expect(sendConfirmation(ID, "jan@example.com", { store: store(), mailer: failing, siteUrl: SITE })).resolves.toBeUndefined();
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain("jan@example.com");
  });
});

describe("handleSubmit + e-mail", () => {
  it("e-mail se pošle odloženě (after), odpověď na něj nečeká", async () => {
    const tasks: (() => Promise<void>)[] = [];
    const { mailer: m, sent } = mailer();
    const result = await handleSubmit(human, {
      store: store(),
      ip: null,
      userAgent: null,
      mailer: m,
      siteUrl: SITE,
      defer: (t) => tasks.push(t),
    });
    expect(result).toMatchObject({ ok: true, stored: true, alreadyConfirmed: false });
    expect(sent).toHaveLength(0);
    await tasks[0]();
    expect(sent).toHaveLength(1);
  });

  it("už potvrzená adresa → žádný další e-mail", async () => {
    const tasks: (() => Promise<void>)[] = [];
    const s = store({ upsert: vi.fn(async () => ({ id: ID, isNew: false, doubleOptInAt: "2026-10-01T00:00:00Z", confirmSentAt: null })) });
    const result = await handleSubmit(human, { store: s, ip: null, userAgent: null, mailer: mailer().mailer, siteUrl: SITE, defer: (t) => tasks.push(t) });
    expect(result).toMatchObject({ alreadyConfirmed: true });
    expect(tasks).toHaveLength(0);
  });
});

describe("handleConfirm", () => {
  it("nesmyslný token do DB vůbec nejde", async () => {
    const s = store();
    for (const t of [null, "", "abc", "x".repeat(43) + "!", 42]) {
      expect(await handleConfirm(t, s)).toMatchObject({ status: "invalid" });
    }
    expect(s.confirm).not.toHaveBeenCalled();
  });

  it("platný tvar → hledá se podle hashe, vrací atribuci leadu", async () => {
    const s = store();
    const token = "A".repeat(43);
    expect(await handleConfirm(token, s)).toEqual({ status: "confirmed", adVariant: "b", utm: { utm_source: "meta" } });
    expect(s.confirm).toHaveBeenCalledWith(hashToken(token));
  });

  it("výpadek databáze se pozná (výjimka), není to „neplatný odkaz“", async () => {
    const s = store({ confirm: vi.fn().mockRejectedValue(new Error("down")) });
    await expect(handleConfirm("A".repeat(43), s)).rejects.toThrow();
  });
});

describe("handleUnsubscribe", () => {
  it("projde jen podpis určený k odhlášení", async () => {
    const s = store();
    expect(await handleUnsubscribe(signUnsubscribe(ID), s)).toBe(true);
    expect(s.unsubscribe).toHaveBeenCalledWith(ID);
    expect(await handleUnsubscribe(sign(ID), s)).toBe(false); // ref pro kvalifikační otázku
    expect(await handleUnsubscribe(`unsub:${ID}.podvrh`, s)).toBe(false);
    expect(await handleUnsubscribe(sign("unsub:neni-uuid"), s)).toBe(false);
    expect(await handleUnsubscribe(null, s)).toBe(false);
    expect(s.unsubscribe).toHaveBeenCalledTimes(1);
  });
});

describe("confirmationEmail", () => {
  const email = confirmationEmail({
    confirmUrl: `${SITE}/potvrzeni?t=TOKEN`,
    unsubscribeUrl: `${SITE}/odhlaseni?u=SIG`,
    dataDate: "2026-10-08",
  });

  it("obsahuje potvrzení, odhlášení, odesílatele a celé rizikové upozornění (HTML i text)", () => {
    for (const body of [email.html, email.text]) {
      expect(body).toContain(`${SITE}/potvrzeni?t=TOKEN`);
      expect(body).toContain(`${SITE}/odhlaseni?u=SIG`);
      expect(body).toContain(OPERATOR.name);
      expect(body).toContain(OPERATOR.email);
      expect(body).toContain(formatDate("2026-10-08"));
      expect(body).toContain("nejde o obchodní sdělení");
    }
    for (const warning of RISK_WARNINGS) expect(email.text).toContain(warning);
  });

  it("odkazy vedou jen na náš web (žádné cizí odkazy ani propagace)", () => {
    const hrefs = [...email.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThanOrEqual(2);
    for (const href of hrefs) expect(href.startsWith(SITE)).toBe(true);
    expect(email.text).not.toMatch(/kupte|koupit|sleva|akce/i);
  });

  it("escapuje HTML v odkazech", () => {
    const evil = confirmationEmail({ confirmUrl: `${SITE}/"><script>`, unsubscribeUrl: SITE, dataDate: "2026-10-08" });
    expect(evil.html).not.toContain("<script>");
  });
});
