// Stav formuláře na stránce sdílený mezi oběma místy (pod výsledkem kalkulačky a dole), sticky lištou
// a srovnáním. Jen v paměti stránky. Aktivní je vždy jen jeden formulář a po odeslání kterýmkoli
// z nich se oba přepnou do děkovacího stavu.

/** Stav uložení leadu: čeká se na server / uloženo / adresa už dřív potvrzená / nepovedlo se (Supabase, limit). */
export type Delivery = "pending" | "sent" | "confirmed" | "failed";

export type FormLocation = "calc" | "bottom";

export type LeadFlow = {
  /** Návštěvník viděl výsledek kalkulačky (calc_result). */
  calcDone: boolean;
  activeForm: FormLocation;
  /** Návštěvník už psal do spodního formuláře – ten pak zůstává aktivní i po výsledku kalkulačky. */
  bottomTouched: boolean;
  /** Kde byl formulář odeslán (null = zatím ne). */
  submittedAt: FormLocation | null;
  delivery: Delivery;
  leadRef: string | null;
};

export const FORM_ANCHOR: Record<FormLocation, string> = { calc: "formular-kalkulacka", bottom: "formular" };

const INITIAL: LeadFlow = {
  calcDone: false,
  activeForm: "bottom",
  bottomTouched: false,
  submittedAt: null,
  delivery: "pending",
  leadRef: null,
};

let state = INITIAL;
const listeners = new Set<() => void>();

function set(patch: Partial<LeadFlow>) {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

export function getLeadFlow(): LeadFlow {
  return state;
}

export function getServerLeadFlow(): LeadFlow {
  return INITIAL;
}

export function subscribeLeadFlow(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Výsledek kalkulačky: formulář se přesune pod něj, pokud návštěvník nemá rozepsaný ten dole. */
export function calcResultShown() {
  if (state.calcDone) return;
  set({ calcDone: true, activeForm: state.bottomTouched || state.submittedAt ? state.activeForm : "calc" });
}

export function touchBottomForm() {
  if (!state.bottomTouched) set({ bottomTouched: true });
}

export function markSubmitted(location: FormLocation) {
  set({ submittedAt: location, activeForm: location });
}

export function setDelivery(delivery: Delivery, leadRef: string | null) {
  set({ delivery, leadRef: leadRef ?? state.leadRef });
}

/** Posune aktivní formulář doprostřed obrazovky a dá focus poli pro e-mail. */
export function focusLeadForm() {
  const box = document.getElementById(FORM_ANCHOR[state.activeForm]);
  if (!box) return;
  const input = box.querySelector<HTMLInputElement>('input[type="email"]');
  (input ?? box).scrollIntoView({ block: "center" });
  input?.focus({ preventScroll: true });
}
