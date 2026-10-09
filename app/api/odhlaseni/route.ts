// One-click odhlášení z hlavičky List-Unsubscribe-Post (RFC 8058): Gmail, Apple Mail a další
// pošlou POST přímo sem. Podpis v `u` brání odhlášení cizí adresy.
import { handleUnsubscribe, supabaseStore } from "@/lib/lead-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const signed = new URL(request.url).searchParams.get("u");
  const client = supabaseAdmin();
  const ok = await handleUnsubscribe(signed, client ? supabaseStore(client) : null);
  return new Response(ok ? "Odhlášeno." : "Neplatný odkaz.", {
    status: ok ? 200 : 400,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
