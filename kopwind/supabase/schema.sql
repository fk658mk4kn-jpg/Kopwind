-- Schema voor de fietscheck: synchronisatie en meldingen.
-- Plakken in de Supabase SQL editor (eenmalig).

create table if not exists profielen (
  code_hash text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists push_abos (
  endpoint text primary key,
  code_hash text not null references profielen(code_hash) on delete cascade,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists push_abos_code on push_abos(code_hash);

create table if not exists melding_log (
  code_hash text not null,
  sleutel text not null,
  verzonden timestamptz not null default now(),
  primary key (code_hash, sleutel)
);

-- RLS aan zonder policies: alleen de service-role key (server) kan erbij.
alter table profielen enable row level security;
alter table push_abos enable row level security;
alter table melding_log enable row level security;
