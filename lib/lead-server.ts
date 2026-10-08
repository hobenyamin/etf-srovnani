// Uložení leadu na serveru. Úložiště se předává zvenku (`LeadStore`), aby šla logika testovat bez sítě.
// IP adresa slouží jen jako klíč limitu v paměti – do databáze ani do logů nejde.
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CalcInput } from "@/lib/calc";
import { FEE_ROWS } from "@/lib/fee-rows";
import { computeFees } from "@/lib/fees";
import { type ParsedLead, parseLeadInput, type QualifyAnswer, QUALIFY_ANSWERS } from "@/lib/lead";
import { createRateLimiter } from "@/lib/rate-limit";
import { sign, verify } from "@/lib/sign";
import { CONSENT } from "@/lib/site";

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

export type LeadStore = {
  upsert(params: UpsertLeadParams): Promise<StoredLead>;
  setQualify(id: string, answer: QualifyAnswer): Promise<void>;
};

export type SubmitResult =
  | { ok: true; stored: boolean; ref: string | null }
  | { ok: false; error: "email" | "invalid" };

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
    return { ok: true, stored: true, ref: sign(lead.id) };
  } catch (error) {
    // Bez e-mailu a bez detailů – v chybě databáze může být hodnota řádku.
    console.error("[lead] uložení selhalo:", errorCode(error));
    return { ok: true, stored: false, ref: null };
  }
}

export async function handleQualify(ref: unknown, answer: unknown, store: LeadStore | null): Promise<boolean> {
  const id = verify(ref);
  const valid = QUALIFY_ANSWERS.some((a) => a.value === answer);
  if (!id || !valid || !store) return false;
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
  };
}
