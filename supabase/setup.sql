-- Run once in your Supabase project's SQL Editor.
-- Safe to run again when updating the extension.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.abhyas_token_sync (
  token_hash bytea primary key,
  revision bigint not null check (revision >= 0 and revision <= 9007199254740991),
  change_id uuid not null,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now()
);

-- Clients never access this table directly. The function hashes the token and
-- returns neither the hash nor the plaintext token.
alter table public.abhyas_token_sync enable row level security;
revoke all on public.abhyas_token_sync from public, anon, authenticated;

create or replace function public.abhyas_token_exchange(
  p_sync_token text,
  p_revision bigint,
  p_change_id uuid,
  p_payload jsonb
)
returns table(revision bigint, change_id uuid, payload jsonb, updated_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token_hash bytea;
begin
  if p_sync_token !~ '^[A-Za-z0-9_-]{43,128}$' then
    raise exception 'Invalid sync token';
  end if;
  if p_revision < 0 or p_revision > 9007199254740991 or p_change_id is null
    or p_payload is null or p_payload->>'version' is distinct from '1'
    or jsonb_typeof(p_payload->'lists') is distinct from 'array'
    or jsonb_typeof(p_payload->'words') is distinct from 'array'
    or jsonb_typeof(p_payload->'reviews') is distinct from 'array'
    or octet_length(p_payload::text) > 20971520 then
    raise exception 'Invalid snapshot or snapshot exceeds 20 MB';
  end if;

  v_token_hash := extensions.digest(
    pg_catalog.convert_to(p_sync_token, 'UTF8'),
    'sha256'
  );

  insert into public.abhyas_token_sync as stored(
    token_hash, revision, change_id, payload
  ) values (
    v_token_hash, p_revision, p_change_id, p_payload
  )
  on conflict(token_hash) do update
    set revision = excluded.revision,
        change_id = excluded.change_id,
        payload = excluded.payload,
        updated_at = now()
    where (stored.revision, stored.change_id)
      < (excluded.revision, excluded.change_id);

  return query
    select stored.revision, stored.change_id, stored.payload, stored.updated_at
    from public.abhyas_token_sync as stored
    where stored.token_hash = v_token_hash;
end;
$$;

revoke all on function public.abhyas_token_exchange(text, bigint, uuid, jsonb)
  from public, authenticated;
grant execute on function public.abhyas_token_exchange(text, bigint, uuid, jsonb)
  to anon;

-- Make the new or replaced RPC visible to PostgREST immediately.
notify pgrst, 'reload schema';

-- Disable the previous authenticated-user RPC if an earlier setup was used.
drop function if exists public.abhyas_exchange(bigint, uuid, jsonb);
