-- 1) Tabelas
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  role text not null,
  location text,
  link text,
  status text not null,
  applied_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.status_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_application_id uuid not null references public.job_applications(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text,
  created_at timestamptz not null default now()
)

-- 2) Constraints (status)
alter table public.job_applications
  drop constraint if exists job_applications_status_check;
alter table public.job_applications
  add constraint job_applications_status_check
  check (status in ('APPLIED','INTERVIEW','OFFER','REJECTED'));

alter table public.status_history
  drop constraint if exists status_history_to_status_check;
alter table public.status_history
  add constraint status_history_to_status_check
  check (to_status in ('APPLIED','INTERVIEW','OFFER','REJECTED'));

-- 3) Índices
create index if not exists companies_user_id_name_idx
  on public.companies (user_id, name);

create index if not exists job_applications_user_status_applied_idx
  on public.job_applications (user_id, status, applied_at desc);

create index if not exists job_applications_company_id_idx
  on public.job_applications (company_id);

create index if not exists status_history_job_changed_idx
  on public.status_history (job_application_id, changed_at desc);
