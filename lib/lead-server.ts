// Uložení leadu, double opt-in a odhlášení na serveru. Úložiště, odesílání e-mailů i odložené úlohy
// se předávají zvenku, aby šla logika testovat bez sítě.
// IP adresa slouží jen jako klíč limitu v paměti – do databáze ani do logů nejde.
import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CalcInput } from "@/lib/calc";
import { FEE_ROWS } from "@/lib/fee-rows";
import { confirmationEmail, CONFIRM_VALID_DAYS } from "@/lib/email-template";
import type { Mailer } from "@/lib/email";
import { DATA_RETRIEVED_AT } from "@/lib/etfs";
import { computeFees } from "@/lib/fees";
import { type ParsedLead, parseLeadInput, type QualifyAnswer, QUALIFY_ANSWERS } from "@/lib/lead";
import { createRateLimiter } from "@/lib/rate-limit";
import { sign, verify } from "@/lib/sign";
import { CONSENT, OPERATOR } from "@/lib/site";
import type { AdVariant, Utm } from "@/lib/visit";

/** Parametry SQL funkce public.upsert_lead (supabase/migrations/20261009_leads.sql). */
export type UpsertLeadParams = {
  p_email: string;
  p_marketing_consent: boolean;
  p_consent_text: string | null;
  p_notice_text: string;
  p_utm_source: string | null;
  p_utm_medium: string | null;
  p_utm_campaign: string | null;
  p_utm_content: string | null;
  p_ad_variant: string;
  p_calc_input: CalcInput | null;
  p_calc_result: CalcSummary | null;
  p_user_agent: string | null;
};

export type StoredLead = { id: string; isNew: boolean; doubleOptInAt: string | null; confirmSentAt: string | null };

export type ConfirmStatus = "confirmed" | "already" | "expired" | "invalid";
export type ConfirmOutcome = { status: ConfirmStatus; adVariant: AdVariant | null; utm: Utm };

export type LeadStore = {
  upsert(params: UpsertLeadParams): Promise<StoredLead>;
  setQualify(id: string, answer: QualifyAnswer): Promise<void>;
  /** Zabere odeslání potvrzovacího e-mailu (cooldown + hodinový strop v DB). true = poslat. */
  claimConfirmation(id: string, tokenHash: string): Promise<boolean>;
  confirm(tokenHash: string): Promise<ConfirmOutcome>;
  unsubscribe(id: string): Promise<boolean>;
};

export type SubmitResult =
  | { ok: true; stored: boolean; ref: string | null; alreadyConfirmed?: boolean }
  | { ok: false; error: "email" | "invalid" };

/** Další potvrzovací e-mail na stejnou adresu nejdřív po této době. */
export const CONFIRM_COOLDOWN = "10 minutes";
/** Strop potvrzovacích e-mailů za hodinu celkem – ochrana kvóty Resend a reputace domény. */
export const CONFIRM_HOURLY_CAP = 50;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
const UNSUB_PREFIX = "unsub:";

/** 32 náhodných bajtů jako base64url (43 znaků) – jde jen do e-mailu, do DB jen hash. */
export function newConfirmToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Podpis odkazu na odhlášení. Vlastní prefix, aby nešel zaměnit s `ref` pro kvalifikační otázku. */
export function signUnsubscribe(id: string): string | null {
  return sign(UNSUB_PREFIX + id);
}

export type CalcSummary = {
  deposits: number;
  gross_value: number;
  esma_gap: number;
  rows: { id: string; ter: number; cost: number }[];
};

/** Výsledek kalkulačky přepočítaný serverem ze vstupu – číslům z prohlížeče nevěříme. */
export function summarizeCalc(input: CalcInput): CalcSummary {
  const result = computeFees(input, FEE_ROWS);
  return {
    deposits: Math.round(result.deposits),
    gross_value: Math.round(result.grossValue),
    esma_gap: Math.round(result.esmaGap),
    rows: result.rows.map((r) => ({ id: r.id, ter: r.ter, cost: Math.round(r.cost) })),
  };
}

export function buildLeadParams(lead: ParsedLead, userAgent: string | null): UpsertLeadParams {
  return {
    p_email: lead.email,
    p_marketing_consent: lead.marketing,
    p_consent_text: lead.marketing ? CONSENT.marketing : null,
    p_notice_text: CONSENT.notice,
    p_utm_source: lead.utm.utm_source ?? null,
    p_utm_medium: lead.utm.utm_medium ?? null,
    p_utm_campaign: lead.utm.utm_campaign ?? null,
    p_utm_content: lead.utm.utm_content ?? null,
    p_ad_variant: lead.adVariant,
    p_calc_input: lead.calcInput,
    p_calc_result: lead.calcInput ? summarizeCalc(lead.calcInput) : null,
    p_user_agent: userAgent ? userAgent.slice(0, 500) : null,
  };
}

// 20 odeslání za 10 minut z jedné IP. Mobilní operátoři sdílejí IP (CGNAT), proto ne méně.
const ipLimiter = createRateLimiter({ limit: 20, windowMs: 10 * 60_000 });

type SubmitContext = {
  store: LeadStore | null;
  ip: string | null;
  userAgent: string | null;
  limiter?: { hit(key: string): boolean };
  mailer?: Mailer | null;
  siteUrl?: string | null;
  /** Spustí úlohu až po odeslání odpovědi (v Next.js `after`), návštěvník na e-mail nečeká. */
  defer?: (task: () => Promise<void>) => void;
};

export async function handleSubmit(raw: unknown, ctx: SubmitContext): Promise<SubmitResult> {
  const parsed = parseLeadInput(raw);
  if (!parsed.ok) return parsed;
  // Robot dostane stejnou odpověď jako člověk, ale nic se neuloží.
  if (parsed.bot) return { ok: true, stored: true, ref: null };

  const limiter = ctx.limiter ?? ipLimiter;
  if (ctx.ip && !limiter.hit(ctx.ip)) return { ok: true, stored: false, ref: null };
  if (!ctx.store) {
    console.error("[lead] Supabase není nastavený (SUPABASE_URL / SUPABASE_SECRET_KEY)");
    return { ok: true, stored: false, ref: null };
  }

  try {
    const lead = await ctx.store.upsert(buildLeadParams(parsed.lead, ctx.userAgent));
    const alreadyConfirmed = lead.doubleOptInAt !== null;
    if (!alreadyConfirmed) {
      const store = ctx.store;
      const task = () => sendConfirmation(lead.id, parsed.lead.email, { store, mailer: ctx.mailer, siteUrl: ctx.siteUrl });
      if (ctx.defer) ctx.defer(task);
      else await task();
    }
    return { ok: true, stored: true, ref: sign(lead.id), alreadyConfirmed };
  } catch (error) {
    // Bez e-mailu a bez detailů – v chybě databáze může být hodnota řádku.
    console.error("[lead] uložení selhalo:", errorCode(error));
    return { ok: true, stored: false, ref: null };
  }
}

/** Potvrzovací e-mail. Chyby jen loguje – lead zůstává uložený a návštěvník srovnání už má. */
export async function sendConfirmation(
  id: string,
  email: string,
  deps: { store: LeadStore; mailer?: Mailer | null; siteUrl?: string | null },
): Promise<void> {
  const unsubscribe = signUnsubscribe(id);
  if (!deps.mailer || !deps.siteUrl || !unsubscribe) {
    console.error("[lead] e-mail se neposílá: chybí RESEND_API_KEY / EMAIL_FROM / SITE_URL / LEAD_TOKEN_SECRET");
    return;
  }
  try {
    const token = newConfirmToken();
    const tokenHash = hashToken(token);
    if (!(await deps.store.claimConfirmation(id, tokenHash))) return; // cooldown nebo strop
    const unsubscribeUrl = `${deps.siteUrl}/odhlaseni?u=${encodeURIComponent(unsubscribe)}`;
    const oneClickUrl = `${deps.siteUrl}/api/odhlaseni?u=${encodeURIComponent(unsubscribe)}`;
    const rendered = confirmationEmail({
      confirmUrl: `${deps.siteUrl}/potvrzeni?t=${token}`,
      unsubscribeUrl,
      dataDate: DATA_RETRIEVED_AT,
    });
    await deps.mailer.send({
      to: email,
      ...rendered,
      headers: {
        "List-Unsubscribe": `<${oneClickUrl}>, <mailto:${OPERATOR.email}?subject=odhlasit>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      idempotencyKey: `confirm-${tokenHash.slice(0, 48)}`,
    });
  } catch (error) {
    console.error("[lead] potvrzovací e-mail selhal:", errorCode(error));
  }
}

export async function handleConfirm(token: unknown, store: LeadStore | null): Promise<ConfirmOutcome> {
  const invalid: ConfirmOutcome = { status: "invalid", adVariant: null, utm: {} };
  if (typeof token !== "string" || !TOKEN.test(token) || !store) return invalid;
  try {
    return await store.confirm(hashToken(token));
  } catch (error) {
    console.error("[lead] potvrzení selhalo:", errorCode(error));
    throw new Error("confirm-failed");
  }
}

export async function handleUnsubscribe(signed: unknown, store: LeadStore | null): Promise<boolean> {
  const value = verify(signed);
  if (!value?.startsWith(UNSUB_PREFIX) || !store) return false;
  const id = value.slice(UNSUB_PREFIX.length);
  if (!UUID.test(id)) return false;
  try {
    return await store.unsubscribe(id);
  } catch (error) {
    console.error("[lead] odhlášení selhalo:", errorCode(error));
    return false;
  }
}

export async function handleQualify(ref: unknown, answer: unknown, store: LeadStore | null): Promise<boolean> {
  const id = verify(ref);
  const valid = QUALIFY_ANSWERS.some((a) => a.value === answer);
  if (!id || !UUID.test(id) || !valid || !store) return false;
  try {
    await store.setQualify(id, answer as QualifyAnswer);
    return true;
  } catch (error) {
    console.error("[lead] uložení odpovědi selhalo:", errorCode(error));
    return false;
  }
}

/** Kód a zpráva chyby bez `details` (tam Postgres dává hodnoty řádku, např. e-mail). */
function errorCode(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as { code?: unknown; name?: unknown; message?: unknown };
    return [e.code || e.name, e.message].filter(Boolean).map(String).join(" ").slice(0, 160) || "unknown";
  }
  return "unknown";
}

export function supabaseStore(client: SupabaseClient): LeadStore {
  return {
    async upsert(params) {
      const { data, error } = await client.rpc("upsert_lead", params).single<{
        id: string;
        is_new: boolean;
        double_opt_in_at: string | null;
        confirm_sent_at: string | null;
      }>();
      if (error) throw error;
      return {
        id: data.id,
        isNew: data.is_new,
        doubleOptInAt: data.double_opt_in_at,
        confirmSentAt: data.confirm_sent_at,
      };
    },
    async setQualify(id, answer) {
      const { error } = await client.from("leads").update({ has_broker: answer }).eq("id", id);
      if (error) throw error;
    },
    async claimConfirmation(id, tokenHash) {
      const { data, error } = await client.rpc("claim_confirmation", {
        p_id: id,
        p_token_hash: tokenHash,
        p_cooldown: CONFIRM_COOLDOWN,
        p_hourly_cap: CONFIRM_HOURLY_CAP,
      });
      if (error) throw error;
      return data === true;
    },
    async confirm(tokenHash) {
      const { data, error } = await client
        .rpc("confirm_lead", { p_token_hash: tokenHash, p_valid_for: `${CONFIRM_VALID_DAYS} days` })
        .single<{
          status: ConfirmStatus;
          ad_variant: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
        }>();
      if (error) throw error;
      const utm: Utm = {};
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const) {
        if (data[key]) utm[key] = data[key];
      }
      return {
        status: data.status,
        adVariant: data.ad_variant === "a" || data.ad_variant === "b" ? data.ad_variant : null,
        utm,
      };
    },
    async unsubscribe(id) {
      const { data, error } = await client.rpc("unsubscribe_lead", { p_id: id });
      if (error) throw error;
      return data === true;
    },
  };
}
