alter table public.leads
add column if not exists plan text;

update public.leads
set plan = 'free'
where plan is null;

alter table public.leads
alter column plan set default 'free';

comment on column public.leads.plan is 'Lead plan status, e.g. free or paid';
