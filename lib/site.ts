// Údaje o provozovateli. Nevymýšlíme je: dokud je nedoplní člověk, stránka ukazuje viditelné „[doplnit …]“.
export const OPERATOR: {
  name: string | null;
  ico: string | null;
  address: string | null;
  email: string | null;
} = {
  name: null,
  ico: null,
  address: null,
  email: null,
};

export function orTodo(value: string | null, what: string): string {
  return value ?? `[doplnit ${what}]`;
}

/** Znění souhlasů – ukládá se k leadu spolu s časem (krok 4). Doručení obsahu ≠ obchodní sdělení. */
export const CONSENT = {
  delivery:
    "E-mail použijeme k zaslání srovnání, o které žádáte (čl. 6 odst. 1 písm. b GDPR – vyřízení vaší žádosti).",
  marketing:
    "Chci občas dostávat e-mailem novinky ke srovnání ETF. Souhlas můžu kdykoli odvolat odkazem v každém e-mailu.",
} as const;
