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

/** Znění souhlasů – ukládá se k leadu spolu s časem (krok 4). Doručení obsahu ≠ obchodní sdělení. */
export const CONSENT = {
  delivery:
    "E-mail použijeme k zaslání srovnání, o které žádáte (čl. 6 odst. 1 písm. b GDPR – vyřízení vaší žádosti).",
  marketing:
    "Chci občas dostávat e-mailem novinky ke srovnání ETF. Souhlas můžu kdykoli odvolat odkazem v každém e-mailu.",
} as const;
