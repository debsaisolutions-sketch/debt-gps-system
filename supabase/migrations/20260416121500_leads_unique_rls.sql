-- Prevent duplicate calculator_login rows per email (email is normalized to lowercase in the app)
create unique index if not exists leads_email_source_unique
  on public.leads (email, source);

alter table public.leads enable row level security;

-- Client can insert leads; no public reads (use service role / dashboard for reporting)
create policy "leads_insert_anon"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

create policy "leads_no_select_anon"
  on public.leads
  for select
  to anon, authenticated
  using (false);
