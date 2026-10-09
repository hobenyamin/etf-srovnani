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

/**
 * Znění u formuláře. Ukládá se k leadu přesně tak, jak ho návštěvník viděl:
 * `notice` vždy, `marketing` jen se zaškrtnutým souhlasem (spolu s časem). Doručení obsahu ≠ obchodní sdělení.
 */
export const CONSENT = {
  delivery: DELIVERY,
  marketing:
    "Chci občas dostávat e-mailem novinky ke srovnání ETF. Souhlas můžu kdykoli odvolat odkazem v každém e-mailu.",
  notice: `Správce: ${OPERATOR.name} (${OPERATOR.email}). ${DELIVERY} Novinky posíláme jen se souhlasem výše (čl. 6 odst. 1 písm. a GDPR).`,
} as const;

/** Doba uložení (zobrazuje se v zásadách, mazání zajišťuje pg_cron v supabase/migrations). */
export const RETENTION = {
  unconfirmedDays: 30,
} as const;

/** Upozornění na rizika – stejné znění na stránce (Trust) i v e-mailu. */
export const RISK_WARNINGS = [
  "Hodnota investice může klesat i stoupat, můžete přijít o část vložených peněz.",
  "Fondy investují v USD. Změna kurzu USD/CZK může výnos v korunách snížit i zvýšit.",
  "Minulé ani modelové výnosy nezaručují výnosy budoucí.",
  "Údaje platí k datu uvedenému u zdroje a mohou se změnit.",
  "Stránka je vzdělávací srovnání s daty, ne investiční doporučení ani nabídka produktu.",
] as const;
