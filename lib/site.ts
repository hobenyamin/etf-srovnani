// Údaje o provozovateli (zadal člověk). Ukázkový projekt nemá IČO ani sídlo – před ostrým spuštěním
// je nutné doplnit skutečného provozovatele (viz README, „Co chybí“). Prázdné údaje se nezobrazují.
export const OPERATOR: {
  about: string;
  name: string;
  email: string;
  ico: string | null;
  address: string | null;
} = {
  about: "Ukázkový projekt do výběrového řízení.",
  name: "Nikolas Hošek",
  email: "hosek@weborio.cz",
  ico: null,
  address: null,
};

const DELIVERY =
  "E-mail použijeme k zaslání srovnání, o které žádáte (čl. 6 odst. 1 písm. b GDPR – vyřízení vaší žádosti).";

/** Doba uložení (zobrazuje se u formuláře a v zásadách, mazání zajišťuje pg_cron v supabase/migrations). */
export const RETENTION = {
  unconfirmedDays: 30,
} as const;

// Vrstvená informace podle čl. 13 GDPR: první vrstva (správce a účel) je u formuláře vidět vždy,
// druhá je v rozbalovacím poli „Podrobnosti“ hned pod ní, plné znění v /zasady.
const NOTICE_SHORT = `Správce: ${OPERATOR.name}. E-mail použijeme k zaslání srovnání.`;
const NOTICE_DETAILS = [
  "Právní základ: vyřízení vaší žádosti (čl. 6 odst. 1 písm. b GDPR). Novinky jen se souhlasem výše (čl. 6 odst. 1 písm. a GDPR).",
  `Doba uložení: nepotvrzenou adresu mažeme po ${RETENTION.unconfirmedDays} dnech, potvrzenou do odvolání souhlasu nebo žádosti o výmaz.`,
  `Vaše práva: přístup, oprava, výmaz, odvolání souhlasu, námitka a stížnost u Úřadu pro ochranu osobních údajů. Kontakt: ${OPERATOR.email}.`,
] as const;

/**
 * Znění u formuláře. Ukládá se k leadu přesně tak, jak ho návštěvník dostal:
 * `notice` (obě vrstvy) vždy, `marketing` jen se zaškrtnutým souhlasem (spolu s časem). Doručení obsahu ≠ obchodní sdělení.
 */
export const CONSENT = {
  delivery: DELIVERY,
  marketing:
    "Chci občas dostávat e-mailem novinky ke srovnání ETF. Souhlas můžu kdykoli odvolat odkazem v každém e-mailu.",
  noticeShort: NOTICE_SHORT,
  noticeDetails: NOTICE_DETAILS,
  notice: [NOTICE_SHORT, ...NOTICE_DETAILS].join(" "),
} as const;

/** Upozornění na rizika – stejné znění na stránce (Trust) i v e-mailu. */
export const RISK_WARNINGS = [
  "Hodnota investice může klesat i stoupat, můžete přijít o část vložených peněz.",
  "Fondy vedou hodnotu v USD a drží akcie v cizích měnách. Změna kurzu koruny může výnos v korunách snížit i zvýšit.",
  "Minulé ani modelové výnosy nezaručují výnosy budoucí.",
  "Údaje platí k datu uvedenému u zdroje a mohou se změnit.",
  "Stránka je vzdělávací srovnání s daty, ne investiční doporučení ani nabídka produktu.",
] as const;
