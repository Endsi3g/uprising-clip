-- Uprising Clip – Schéma initial (profiles, videos, transcripts, clips, jobs)
-- À exécuter dans l’éditeur SQL Supabase ou via CLI: supabase db push

-- Profils (lié à auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

-- Vidéos
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  source_type text not null check (source_type in ('upload', 'url')),
  source_url text,
  storage_path text,
  status text not null default 'uploading' check (status in ('uploading', 'transcribing', 'analyzing', 'rendering', 'done', 'error')),
  duration_sec int,
  created_at timestamptz default now()
);

create index videos_user_id on public.videos(user_id);
create index videos_status on public.videos(status);

-- Transcripts
create table if not exists public.transcripts (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  raw_text text,
  segments jsonb,
  model text,
  created_at timestamptz default now()
);

create index transcripts_video_id on public.transcripts(video_id);

-- Clips
create table if not exists public.clips (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  title text not null,
  start_sec float not null,
  end_sec float not null check (end_sec > start_sec),
  hook text,
  virality_score int check (virality_score >= 0 and virality_score <= 100),
  status text not null default 'pending' check (status in ('pending', 'rendering', 'ready', 'error')),
  output_path text,
  created_at timestamptz default now()
);

create index clips_video_id on public.clips(video_id);

-- Jobs (file d’orchestration worker)
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('transcription', 'analysis', 'render')),
  video_id uuid not null references public.videos(id) on delete cascade,
  payload jsonb default '{}',
  status text not null default 'pending' check (status in ('pending', 'running', 'done', 'error')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index jobs_status on public.jobs(status);
create index jobs_video_id on public.jobs(video_id);

-- Trigger updated_at pour jobs
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.transcripts enable row level security;
alter table public.clips enable row level security;
alter table public.jobs enable row level security;

-- Profils : lecture/écriture par propriétaire
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Vidéos : CRUD par user_id
create policy "videos_select_own" on public.videos for select using (auth.uid() = user_id);
create policy "videos_insert_own" on public.videos for insert with check (auth.uid() = user_id);
create policy "videos_update_own" on public.videos for update using (auth.uid() = user_id);
create policy "videos_delete_own" on public.videos for delete using (auth.uid() = user_id);

-- Transcripts / clips : lecture par propriétaire de la vidéo, écriture par service (on utilise service_role côté worker)
create policy "transcripts_select_video_owner" on public.transcripts for select
  using (exists (select 1 from public.videos v where v.id = video_id and v.user_id = auth.uid()));
create policy "transcripts_insert_service" on public.transcripts for insert with check (true);
create policy "transcripts_update_service" on public.transcripts for update using (true);

create policy "clips_select_video_owner" on public.clips for select
  using (exists (select 1 from public.videos v where v.id = video_id and v.user_id = auth.uid()));
create policy "clips_insert_service" on public.clips for insert with check (true);
create policy "clips_update_service" on public.clips for update using (true);

-- Jobs : lecture par propriétaire vidéo (pour l’UI), écriture complète pour le worker (service_role)
create policy "jobs_select_video_owner" on public.jobs for select
  using (exists (select 1 from public.videos v where v.id = video_id and v.user_id = auth.uid()));
create policy "jobs_all_service" on public.jobs for all using (true);

-- Création du profil à l’inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
