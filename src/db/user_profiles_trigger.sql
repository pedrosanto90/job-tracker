-- Ensures user_profiles is populated automatically from auth.users with a mandatory username

-- Enable RLS on user_profiles
alter table public.user_profiles enable row level security;

-- One profile per user
alter table public.user_profiles
  add constraint user_profiles_user_id_key unique (user_id);

-- Enforce non-empty username
alter table public.user_profiles
  add constraint user_profiles_username_not_empty
  check (length(trim(username)) > 0);

alter table public.user_profiles
  alter column username set not null;

-- Trigger function to create profile after auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text;
begin
  v_username := nullif(trim(coalesce(new.raw_user_meta_data->>'username', '')), '');

  if v_username is null then
    raise exception 'username is required';
  end if;

  insert into public.user_profiles (user_id, username)
  values (new.id, v_username);

  return new;
end;
$$;

-- Trigger to run after a new auth user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
