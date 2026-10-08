"use server";

import { headers } from "next/headers";
import { handleQualify, handleSubmit, type SubmitResult, supabaseStore } from "@/lib/lead-server";
import { supabaseAdmin } from "@/lib/supabase";

function store() {
  const client = supabaseAdmin();
  return client ? supabaseStore(client) : null;
}

/** Odeslání formuláře. Kontrolu Origin (CSRF) dělá Next.js u každé Server Action. */
export async function submitLead(payload: unknown): Promise<SubmitResult> {
  const h = await headers();
  return handleSubmit(payload, {
    store: store(),
    // Jen klíč limitu v paměti, neukládá se
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip"),
    userAgent: h.get("user-agent"),
  });
}

/** Nepovinná kvalifikační otázka z děkovací obrazovky. `ref` = podepsané ID leadu ze submitLead. */
export async function saveQualify(ref: unknown, answer: unknown): Promise<boolean> {
  return handleQualify(ref, answer, store());
}
