-- Krok 4b: double opt-in, odhlášení, publikum pro novinky. Spouští se ručně v Supabase → SQL Editor
-- PO migraci 20261009_leads.sql. Jde spustit opakovaně.
--
-- Token potvrzení se generuje na serveru; v DB je jen jeho SHA-256 hash (hex).

create unique index if not exists leads_confirm_token_hash_idx
  on public.leads (confirm_token_hash) where confirm_token_hash is not null;

-- 1) Vydání potvrzovacího e-mailu ----------------------------------------------------------
-- Atomicky „zabere“ odeslání: uloží hash nového tokenu a čas, jen když
--   * adresa ještě není potvrzená,
--   * od posledního e-mailu na tuto adresu uběhl cooldown (ochrana před zahlcením cizí schránky),
--   * za poslední hodinu neodešlo víc než p_hourly_cap potvrzovacích e-mailů celkem.
-- Vrací true = e-mail se má poslat. Nový token nahradí starý (platí jen odkaz z posledního e-mailu).

create or replace function public.claim_confirmation(
  p_id          uuid,
  p_token_hash  text,
  p_cooldown    interval,
  p_hourly_cap  integer
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  claimed uuid;
begin
  if (select count(*) from public.leads where confirm_sent_at > now() - interval '1 hour') >= p_hourly_cap then
    return false;
  end if;

  update public.leads
     set confirm_token_hash = p_token_hash,
         confirm_sent_at = now()
   where id = p_id
     and double_opt_in_at is null
     and (confirm_sent_at is null or confirm_sent_at < now() - p_cooldown)
  returning id into claimed;

  return claimed is not null;
end;
$$;

-- 2) Potvrzení adresy ----------------------------------------------------------------------
-- status: 'confirmed' (právě potvrzeno) | 'already' (už dřív) | 'expired' | 'invalid'.
-- double_opt_in_at se zapíše jen poprvé. Hash zůstává, aby odkaz šel otevřít znovu („už potvrzeno“).
-- Vrací i atribuci leadu pro event lead_confirmed.

create or replace function public.confirm_lead(p_token_hash text, p_valid_for interval)
returns table (
  status       text,
  ad_variant   text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_content  text
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  l public.leads%rowtype;
begin
  select * into l from public.leads where confirm_token_hash = p_token_hash;

  if not found then
    return query select 'invalid'::text, null::text, null::text, null::text, null::text, null::text;
    return;
  end if;

  if l.double_opt_in_at is not null then
    return query select 'already'::text, l.ad_variant, l.utm_source, l.utm_medium, l.utm_campaign, l.utm_content;
    return;
  end if;

  if l.confirm_sent_at is null or l.confirm_sent_at < now() - p_valid_for then
    return query select 'expired'::text, null::text, null::text, null::text, null::text, null::text;
    return;
  end if;

  update public.leads set double_opt_in_at = now() where id = l.id and double_opt_in_at is null;
  return query select 'confirmed'::text, l.ad_variant, l.utm_source, l.utm_medium, l.utm_campaign, l.utm_content;
end;
$$;

-- 3) Odhlášení -----------------------------------------------------------------------------
-- Ruší souhlas s novinkami. Znění a čas původního souhlasu zůstávají jako doklad.

create or replace function public.unsubscribe_lead(p_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  with updated as (
    update public.leads
       set unsubscribed_at = coalesce(unsubscribed_at, now()),
           marketing_consent = false
     where id = p_id
    returning id
  )
  select exists (select 1 from updated);
$$;

-- 4) Komu smíme poslat novinky (480/2004) ---------------------------------------------------
-- Jen se souhlasem, s potvrzenou adresou a bez odhlášení. Rozesílání novinek zatím neexistuje;
-- až vznikne, bere adresy výhradně odsud.

create or replace view public.marketing_audience
with (security_invoker = true) as
  select id, email, consent_at, double_opt_in_at
    from public.leads
   where marketing_consent
     and double_opt_in_at is not null
     and unsubscribed_at is null;

-- Práva: jen serverová role --------------------------------------------------------------

revoke all on function public.claim_confirmation(uuid, text, interval, integer) from public, anon, authenticated;
revoke all on function public.confirm_lead(text, interval) from public, anon, authenticated;
revoke all on function public.unsubscribe_lead(uuid) from public, anon, authenticated;
grant execute on function public.claim_confirmation(uuid, text, interval, integer) to service_role;
grant execute on function public.confirm_lead(text, interval) to service_role;
grant execute on function public.unsubscribe_lead(uuid) to service_role;

revoke all on table public.marketing_audience from public, anon, authenticated;
grant select on table public.marketing_audience to service_role;
