-- À exécuter une fois dans Supabase : SQL Editor > New query > coller > Run

create table if not exists public.checkins (
  id   text primary key,               -- identifiant de l'invité dans index.html
  at   timestamptz not null default now(),
  plus integer not null default 0 check (plus between 0 and 20)
);

create table if not exists public.walkins (
  id   text primary key,
  p    text not null,                  -- prénom
  n    text not null,                  -- nom
  c    text not null default '',       -- entreprise
  at   timestamptz not null default now(),
  plus integer not null default 0 check (plus between 0 and 20)
);

alter table public.checkins enable row level security;
alter table public.walkins  enable row level security;

-- Toute personne qui a le lien de l'app peut lire et pointer.
drop policy if exists "accueil checkins" on public.checkins;
create policy "accueil checkins" on public.checkins
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "accueil walkins" on public.walkins;
create policy "accueil walkins" on public.walkins
  for all to anon, authenticated using (true) with check (true);

-- Mises à jour en temps réel entre les téléphones
alter publication supabase_realtime add table public.checkins;
alter publication supabase_realtime add table public.walkins;

-- Après l'événement, pour repartir de zéro :
-- truncate public.checkins, public.walkins;
