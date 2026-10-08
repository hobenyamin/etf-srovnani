// Podepsané hodnoty v odkazech a odpovědích (ID leadu, odhlášení). HMAC-SHA256 s LEAD_TOKEN_SECRET.
// Bez tajemství podpis nevznikne (vrací null) – funkce, které na něm stojí, se vypnou.
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

function mac(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function sign(value: string, secret = process.env.LEAD_TOKEN_SECRET): string | null {
  if (!secret) return null;
  return `${value}.${mac(value, secret)}`;
}

/** Vrátí původní hodnotu, nebo null při chybějícím či podvrženém podpisu. */
export function verify(signed: unknown, secret = process.env.LEAD_TOKEN_SECRET): string | null {
  if (!secret || typeof signed !== "string") return null;
  const dot = signed.lastIndexOf(".");
  if (dot <= 0) return null;
  const value = signed.slice(0, dot);
  const given = Buffer.from(signed.slice(dot + 1));
  const expected = Buffer.from(mac(value, secret));
  return given.length === expected.length && timingSafeEqual(given, expected) ? value : null;
}
