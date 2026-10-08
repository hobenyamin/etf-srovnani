// Klient Supabase s tajným klíčem (role service_role) – jen pro server. `server-only` shodí build,
// kdyby se soubor dostal do klientského kódu. Bez proměnných prostředí vrací null (lead se neuloží,
// návštěvník srovnání dostane i tak).
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const TIMEOUT_MS = 5000;

let client: SupabaseClient | null | undefined;

export function supabaseAdmin(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  client =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
          global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) }) },
        })
      : null;
  return client;
}
