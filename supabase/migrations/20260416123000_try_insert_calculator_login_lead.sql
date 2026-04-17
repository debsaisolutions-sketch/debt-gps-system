-- Insert calculator_login lead only when this email is not yet present (any source).
-- Runs with definer rights so RLS does not block the existence check.
create or replace function public.try_insert_calculator_login_lead(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v text := lower(trim(p_email));
begin
  if v is null or length(v) = 0 then
    return;
  end if;
  if exists (select 1 from public.leads where email = v limit 1) then
    return;
  end if;
  insert into public.leads (email, source) values (v, 'calculator_login');
exception
  when unique_violation then
    null;
end;
$$;

revoke all on function public.try_insert_calculator_login_lead(text) from public;
grant execute on function public.try_insert_calculator_login_lead(text) to anon, authenticated;
