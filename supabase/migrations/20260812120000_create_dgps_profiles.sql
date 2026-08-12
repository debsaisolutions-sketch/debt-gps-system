-- Debt GPS namespaced profiles (shared Supabase project — do not use bare "profiles")
create table if not exists public.dgps_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text not null default 'none',
  plan_interval text,
  current_period_end timestamptz,
  nudge_email_opt_in boolean not null default true,
  last_nudge_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dgps_profiles_status_check
    check (subscription_status in (
      'none',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'incomplete',
      'incomplete_expired',
      'paused'
    )),
  constraint dgps_profiles_interval_check
    check (plan_interval is null or plan_interval in ('month', 'year'))
);

create index if not exists dgps_profiles_stripe_customer_idx
  on public.dgps_profiles (stripe_customer_id);

create index if not exists dgps_profiles_subscription_idx
  on public.dgps_profiles (stripe_subscription_id);

comment on table public.dgps_profiles is
  'Debt GPS user profile + Stripe subscription state (source of truth for premium).';

alter table public.dgps_profiles enable row level security;

create policy "dgps_profiles_select_own"
  on public.dgps_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "dgps_profiles_update_own"
  on public.dgps_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Inserts are done via service role (ensureProfile) or security definer below.
create or replace function public.dgps_ensure_profile()
returns public.dgps_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  mail text;
  row public.dgps_profiles;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select email into mail from auth.users where id = uid;

  insert into public.dgps_profiles (user_id, email)
  values (uid, mail)
  on conflict (user_id) do update
    set email = coalesce(excluded.email, public.dgps_profiles.email),
        updated_at = now()
  returning * into row;

  return row;
end;
$$;

revoke all on function public.dgps_ensure_profile() from public;
grant execute on function public.dgps_ensure_profile() to authenticated;
