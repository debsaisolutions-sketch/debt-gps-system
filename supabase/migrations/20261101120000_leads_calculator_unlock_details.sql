-- Optional details captured with calculator email-unlock leads.
-- email, source, plan, and created_at already exist. The API writes those
-- on every database, and adds name / inputs_summary only when these columns
-- are present (it retries without them on older schemas).

alter table public.leads
  add column if not exists name text;

alter table public.leads
  add column if not exists inputs_summary text;

comment on column public.leads.name is
  'Name captured with the lead, when the visitor entered one';

comment on column public.leads.inputs_summary is
  'Short debt totals and calculator inputs summary';
