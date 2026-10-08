-- Krok 4a: tabulka leadů. Spouští se ručně v Supabase → SQL Editor (celý soubor najednou).
-- Migrace jde spustit opakovaně (if not exists / create or replace).
--
-- Zásady:
--   * RLS zapnuté a ŽÁDNÉ politiky → anon ani authenticated klíč nic nepřečte ani nezapíše.
--   * Zápis jen ze serveru tajným klíčem (role service_role) přes funkci upsert_lead().
--   * IP adresa se neukládá.
--   * Nepotvrzené leady (double_opt_in_at is null) se po 30 dnech mažou (pg_cron, část 3).

-- 1) Tabulka ------------------------------------------------------------------------------

create table if not exists public.leads (
  id                 uuid primary key default gen_random_uuid(),
  -- normalizovaný (trim + malá písmena) – unikátnost řeší constraint níže
  email              text not null,
  created_at         timestamptz not null default now(),

  -- Souhlas s novinkami (480/2004). Bez souhlasu consent_text i consent_at = null.
  marketing_consent  boolean not null default false,
  consent_text       text,
  consent_at         timestamptz,
  -- Znění informace u formuláře (správce, účel, právní základ), které návštěvník viděl
  notice_text        text not null,

  -- Double opt-in (krok 4b). V DB jen SHA-256 hash tokenu, nikdy token.
  double_opt_in_at   timestamptz,
  confirm_token_hash text,
  confirm_sent_at    timestamptz,
  unsubscribed_at    timestamptz,

  -- Atribuce: první odeslání, další odeslání ji nepřepisují
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  utm_content        text,
  ad_variant         text not null,

  -- Kalkulačka: vstupy oříznuté na povolené rozsahy, výsledek přepočítaný serverem
  calc_input         jsonb,
  calc_result        jsonb,

  -- Nepovinná kvalifikační otázka z děkovací obrazovky
  has_broker         text,

  user_agent         text,

  constraint leads_email_unique unique (email),
  constraint leads_email_normalized check (email = lower(btrim(email)) and length(email) between 6 and 254),
  constraint leads_ad_variant check (ad_variant in ('a', 'b')),
  constraint leads_has_broker check (has_broker is null or has_broker in ('ano', 'ne', 'zvazuji')),
  constraint leads_consent_complete check (
    (marketing_consent and consent_text is not null and consent_at is not null)
    or (not marketing_consent)
  ),
  constraint leads_utm_length check (
    coalesce(length(utm_source), 0) <= 200 and coalesce(length(utm_medium), 0) <= 200
    and coalesce(length(utm_campaign), 0) <= 200 and coalesce(length(utm_content), 0) <= 200
  ),
  constraint leads_user_agent_length check (coalesce(length(user_agent), 0) <= 500)
);

create index if not exists leads_unconfirmed_created_idx
  on public.leads (created_at) where double_opt_in_at is null;

alter table public.leads enable row level security;
-- Záměrně žádné „create policy“: bez politik RLS zakáže vše rolím anon i authenticated.

revoke all on table public.leads from public, anon, authenticated;
-- Nové tabulky se v tomto projektu do Data API nevystavují automaticky → explicitní grant
-- jen pro serverovou roli (tajný klíč sb_secret_…).
grant select, insert, update on table public.leads to service_role;

-- 2) Zápis leadu --------------------------------------------------------------------------
-- Jeden atomický upsert podle e-mailu:
--   * nový e-mail → nový řádek,
--   * opakované odeslání → první atribuce (UTM, varianta, kalkulačka) zůstává,
--     souhlas s novinkami se jen PŘIDÁ (znění + čas nového souhlasu, zruší dřívější odhlášení);
--     odškrtnutý checkbox není odvolání souhlasu (to jde odkazem v e-mailu).

create or replace function public.upsert_lead(
  p_email             text,
  p_marketing_consent boolean,
  p_consent_text      text,
  p_notice_text       text,
  p_utm_source        text,
  p_utm_medium        text,
  p_utm_campaign      text,
  p_utm_content       text,
  p_ad_variant        text,
  p_calc_input        jsonb,
  p_calc_result       jsonb,
  p_user_agent        text
)
returns table (id uuid, is_new boolean, double_opt_in_at timestamptz, confirm_sent_at timestamptz)
language sql
security invoker
set search_path = ''
as $$
  insert into public.leads as l (
    email, marketing_consent, consent_text, consent_at, notice_text,
    utm_source, utm_medium, utm_campaign, utm_content, ad_variant,
    calc_input, calc_result, user_agent
  ) values (
    lower(btrim(p_email)), p_marketing_consent,
    case when p_marketing_consent then p_consent_text end,
    case when p_marketing_consent then now() end,
    p_notice_text,
    p_utm_source, p_utm_medium, p_utm_campaign, p_utm_content, p_ad_variant,
    p_calc_input, p_calc_result, p_user_agent
  )
  on conflict (email) do update set
    marketing_consent = l.marketing_consent or excluded.marketing_consent,
    consent_text = case when excluded.marketing_consent and not l.marketing_consent
                        then excluded.consent_text else l.consent_text end,
    consent_at = case when excluded.marketing_consent and not l.marketing_consent
                      then excluded.consent_at else l.consent_at end,
    unsubscribed_at = case when excluded.marketing_consent and not l.marketing_consent
                           then null else l.unsubscribed_at end
  returning l.id, (l.xmax = 0) as is_new, l.double_opt_in_at, l.confirm_sent_at;
$$;

revoke all on function public.upsert_lead(text, boolean, text, text, text, text, text, text, text, jsonb, jsonb, text)
  from public, anon, authenticated;
grant execute on function public.upsert_lead(text, boolean, text, text, text, text, text, text, text, jsonb, jsonb, text)
  to service_role;

-- 3) Doba uložení: nepotvrzené leady po 30 dnech pryč --------------------------------------

create or replace function public.purge_unconfirmed_leads()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted integer;
begin
  delete from public.leads
  where double_opt_in_at is null
    and created_at < now() - interval '30 days';
  get diagnostics deleted = row_count;
  return deleted;
end;
$$;

revoke all on function public.purge_unconfirmed_leads() from public, anon, authenticated, service_role;
-- Volá jen pg_cron (běží jako postgres) nebo člověk v SQL editoru.

-- pg_cron: podle dokumentace Supabase se zapíná příkazem níže, nebo v Dashboardu:
-- Integrations → Cron (případně Database → Extensions → pg_cron).
-- Pokud tento řádek v SQL editoru selže, zapněte rozšíření v Dashboardu a spusťte jen zbytek
-- souboru od tohoto místa.
create extension if not exists pg_cron with schema pg_catalog;

-- Denně ve 3:15 UTC. Stejný název úlohu přepíše, takže opakované spuštění nevytvoří duplikát.
select cron.schedule(
  'purge-unconfirmed-leads',
  '15 3 * * *',
  'select public.purge_unconfirmed_leads()'
);

-- Kontrola po spuštění:
--   select jobname, schedule, command, active from cron.job;
--   select * from cron.job_run_details order by start_time desc limit 5;
