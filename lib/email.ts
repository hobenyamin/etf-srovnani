// Odesílání e-mailů přes Resend (region Ireland, doména mail.hosek.cc). Jen server.
// Bez RESEND_API_KEY / EMAIL_FROM vrací null – e-mail se neodešle, lead zůstane uložený.
import "server-only";
import { Resend } from "resend";
import { OPERATOR } from "@/lib/site";

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
  /** Stejný klíč = Resend e-mail podruhé nepošle (opakovaný pokus po výpadku) */
  idempotencyKey: string;
};

export type Mailer = { send(email: OutgoingEmail): Promise<void> };

export function resendMailer(): Mailer | null {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return null;
  const resend = new Resend(key);
  return {
    async send({ idempotencyKey, ...email }) {
      const { error } = await resend.emails.send({ from, replyTo: OPERATOR.email, ...email }, { idempotencyKey });
      if (error) throw error;
    },
  };
}

/** Základ odkazů v e-mailech (SITE_URL bez lomítka na konci). */
export function siteUrl(): string | null {
  const url = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  return url || null;
}
