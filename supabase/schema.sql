create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  target_role text not null,
  experience_years int not null default 0,
  skills text[] not null default '{}',
  location_preference text,
  work_types text[] not null default '{}',
  salary_expectation text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text,
  salary text,
  job_url text unique,
  description text not null,
  source text default 'manual',
  created_at timestamp with time zone default now()
);

create table if not exists job_matches (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  job_id uuid not null references jobs(id) on delete cascade,
  match_score int not null,
  decision text not null check (decision in ('apply', 'maybe', 'skip')),
  matched_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  reason text not null,
  suggested_resume_keywords text[] not null default '{}',
  created_at timestamp with time zone default now(),
  unique(user_id, job_id)
);

create table if not exists saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  job_id uuid not null references jobs(id) on delete cascade,
  status text not null default 'saved' check (status in ('saved', 'applied', 'interviewing', 'rejected', 'offer')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, job_id)
);