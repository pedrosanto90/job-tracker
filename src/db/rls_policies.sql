-- Enable RLS
alter table public.companies enable row level security;
alter table public.job_applications enable row level security;
alter table public.status_history enable row level security;

-- Companies policies
drop policy if exists "companies_select_own" on public.companies;
create policy "companies_select_own"
on public.companies for select
using (user_id = auth.uid());

drop policy if exists "companies_insert_own" on public.companies;
create policy "companies_insert_own"
on public.companies for insert
with check (user_id = auth.uid());

drop policy if exists "companies_update_own" on public.companies;
create policy "companies_update_own"
on public.companies for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "companies_delete_own" on public.companies;
create policy "companies_delete_own"
on public.companies for delete
using (user_id = auth.uid());

-- Job applications policies
drop policy if exists "jobs_select_own" on public.job_applications;
create policy "jobs_select_own"
on public.job_applications for select
using (user_id = auth.uid());

drop policy if exists "jobs_insert_own" on public.job_applications;
create policy "jobs_insert_own"
on public.job_applications for insert
with check (user_id = auth.uid());

drop policy if exists "jobs_update_own" on public.job_applications;
create policy "jobs_update_own"
on public.job_applications for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "jobs_delete_own" on public.job_applications;
create policy "jobs_delete_own"
on public.job_applications for delete
using (user_id = auth.uid());

-- Status history policies
drop policy if exists "history_select_own" on public.status_history;
create policy "history_select_own"
on public.status_history for select
using (user_id = auth.uid());

drop policy if exists "history_insert_own" on public.status_history;
create policy "history_insert_own"
on public.status_history for insert
with check (user_id = auth.uid());

drop policy if exists "user_profiles_select_own" on public.user_profiles;
create policy "user_profiles_select_own"
on public.user_profiles for select
using (user_id = auth.uid());
