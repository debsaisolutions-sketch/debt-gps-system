-- Leads capture (e.g. source: "google_ads")
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text,
  created_at timestamptz not null default now(),
  source text
);

comment on table public.leads is 'Marketing / signup leads';
comment on column public.leads.source is 'Attribution, e.g. google_ads';
