// Proměnné testovacího serveru, společné pro E2E (playwright.config.ts) a měření výšky
// (scripts/page-height.mjs). Mají přednost před .env.local: Next.js proměnné, které už v procesu
// jsou, z .env souborů nepřepisuje. Testy tak nikdy nesáhnou na ostré služby.
export const TEST_ENV = {
  // Supabase na nedostupné adrese: ověřujeme, že návštěvník srovnání dostane i bez databáze
  SUPABASE_URL: "http://127.0.0.1:9",
  SUPABASE_SECRET_KEY: "e2e-not-a-key",
  LEAD_TOKEN_SECRET: "e2e-secret",
  // Resend nikdy ostře: neplatný klíč (k odeslání beztak nedojde, databáze je nedostupná)
  RESEND_API_KEY: "re_e2e_invalid",
  EMAIL_FROM: "E2E <e2e@example.invalid>",
  SITE_URL: "http://localhost:3100",
  // PostHog: falešný klíč a host, požadavky zachytává page.route v testech (ostrý projekt nikdy)
  NEXT_PUBLIC_POSTHOG_KEY: "phc_e2e_test",
  NEXT_PUBLIC_POSTHOG_HOST: "https://posthog.e2e.test",
};

/**
 * Spadne, pokud by testovací server mířil na ostrou databázi nebo měl skutečný klíč k e-mailům.
 * Volá se před startem serveru, takže se nespustí ani build, ani první test.
 */
export function assertSafeTestEnv(env) {
  const problems = [];
  const supabaseHost = (() => {
    try {
      return new URL(env.SUPABASE_URL ?? "").hostname;
    } catch {
      return "";
    }
  })();
  if (!["127.0.0.1", "localhost"].includes(supabaseHost)) problems.push(`SUPABASE_URL míří na ${supabaseHost || "?"}`);
  if (!env.RESEND_API_KEY?.startsWith("re_e2e_")) problems.push("RESEND_API_KEY není testovací (re_e2e_…)");
  if (!/@[^>]+\.invalid>?$/.test(env.EMAIL_FROM ?? "")) problems.push("EMAIL_FROM není na doméně .invalid");
  if (!env.NEXT_PUBLIC_POSTHOG_HOST?.endsWith(".test")) problems.push("NEXT_PUBLIC_POSTHOG_HOST není testovací");
  if (problems.length) throw new Error(`Testovací server by sahal na ostré služby: ${problems.join("; ")}`);
}
