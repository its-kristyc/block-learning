-- BASI Block System — Supabase schema
-- Paste this whole file into Supabase → SQL Editor → Run.
-- Stores one JSON blob of user data ({ notes, favorites, programs }) per account.

create table if not exists public.user_data (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security: an account can only ever read or write its OWN row.
-- This is what makes the public anon key safe to ship in the browser.
alter table public.user_data enable row level security;

create policy "own row select" on public.user_data
  for select using (auth.uid() = user_id);

create policy "own row insert" on public.user_data
  for insert with check (auth.uid() = user_id);

create policy "own row update" on public.user_data
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
