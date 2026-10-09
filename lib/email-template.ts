// Potvrzovací e-mail (double opt-in) s odkazem na srovnání. Vyřízení žádosti, ne obchodní sdělení
// (480/2004) – proto v něm není žádná propagace. HTML s inline styly kvůli e-mailovým klientům.
import { formatDate } from "@/lib/format";
import { OPERATOR, RETENTION, RISK_WARNINGS } from "@/lib/site";

export const CONFIRM_VALID_DAYS = 14;

export type ConfirmationEmailInput = {
  confirmUrl: string;
  unsubscribeUrl: string;
  /** Datum stažení dat (YYYY-MM-DD) */
  dataDate: string;
};

export type RenderedEmail = { subject: string; html: string; text: string };

const C = { paper: "#f3efe6", card: "#fbf9f4", ink: "#16181d", muted: "#5e5a52", rule: "#c9c2b3" };

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function operatorLine(): string {
  return [OPERATOR.name, OPERATOR.ico && `IČO ${OPERATOR.ico}`, OPERATOR.address, OPERATOR.email]
    .filter(Boolean)
    .join(", ");
}

export function confirmationEmail({ confirmUrl, unsubscribeUrl, dataDate }: ConfirmationEmailInput): RenderedEmail {
  const subject = "Potvrďte e-mail: srovnání ETF z NYSE a UCITS";
  const preheader = "Jedním klepnutím potvrdíte adresu a otevřete plné srovnání 5 dvojic fondů.";
  const intro =
    "na stránce se srovnáním ETF jste zadali tuto adresu a požádali o plné srovnání 5 dvojic fondů: ETF z NYSE vedle UCITS fondů, které jsou v ČR dostupné.";
  const validity = `Odkaz platí ${CONFIRM_VALID_DAYS} dní. Pokud jste o srovnání nežádali, e-mail ignorujte – nepotvrzenou adresu do ${RETENTION.unconfirmedDays} dnů smažeme.`;
  const dataLine = `Data ve srovnání jsou ke dni ${formatDate(dataDate)}.`;
  const sender = `Odesílá ${operatorLine()}. ${OPERATOR.about}`;
  const notMarketing = "Tento e-mail je odpovědí na vaši žádost, nejde o obchodní sdělení.";

  const text = [
    "Dobrý den,",
    "",
    intro,
    "",
    "Potvrďte adresu a otevřete srovnání:",
    confirmUrl,
    "",
    validity,
    "",
    "Upozornění na rizika",
    ...RISK_WARNINGS.map((w) => `- ${w}`),
    `- ${dataLine}`,
    "",
    "--",
    sender,
    notMarketing,
    `Nechcete od nás další e-maily? Odhlásit se: ${unsubscribeUrl}`,
  ].join("\n");

  const p = (content: string, style = "") =>
    `<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:${C.ink};${style}">${content}</p>`;

  const html = `<!doctype html>
<html lang="cs">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;font-family:Arial,Helvetica,sans-serif;">
<tr><td style="padding:0 0 16px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">Srovnání ETF z NYSE · pro investory v ČR</td></tr>
<tr><td style="background:${C.card};border-top:2px solid ${C.ink};padding:24px;">
${p("Dobrý den,")}
${p(esc(intro))}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="background:${C.ink};border-radius:2px;">
<a href="${esc(confirmUrl)}" style="display:inline-block;padding:16px 24px;font-size:16px;font-weight:bold;color:${C.paper};text-decoration:none;">Potvrdit a otevřít srovnání</a>
</td></tr></table>
${p(esc(validity), `font-size:14px;line-height:20px;color:${C.muted};`)}
<div style="border:2px solid ${C.ink};padding:16px;margin-top:8px;">
<p style="margin:0 0 8px;font-size:15px;font-weight:bold;color:${C.ink};">Upozornění na rizika</p>
<ul style="margin:0;padding-left:20px;font-size:14px;line-height:20px;color:${C.ink};">
${[...RISK_WARNINGS, dataLine].map((w) => `<li style="margin:0 0 4px;">${esc(w)}</li>`).join("\n")}
</ul>
</div>
</td></tr>
<tr><td style="padding:16px 0;font-size:13px;line-height:19px;color:${C.muted};">
${esc(sender)}<br>${esc(notMarketing)}<br>
Nechcete od nás další e-maily? <a href="${esc(unsubscribeUrl)}" style="color:${C.muted};">Odhlásit se</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, html, text };
}
