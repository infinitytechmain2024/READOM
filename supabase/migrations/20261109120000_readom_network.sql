-- READOM Network: the READ token on an off-chain, hash-chained ledger.
--
-- Mirrors src/integrations/readnet/engine.ts — keep constants and the block
-- payload format identical so the client can verify the chain it reads.
--
-- Clients never write tables directly: all balance changes go through the
-- SECURITY DEFINER functions below, which serialise on an advisory lock so
-- the chain stays strictly linear.

create extension if not exists pgcrypto with schema extensions;

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.readnet_wallets (
  address     text primary key check (address ~ '^rdm1[0-9a-f]{38}$'),
  user_id     uuid unique references auth.users (id) on delete set null,
  author_key  text unique,
  balance     bigint not null default 0 check (balance >= 0),
  created_at  timestamptz not null default now(),
  check (user_id is not null or author_key is not null)
);

create table if not exists public.readnet_blocks (
  height      bigint primary key,
  prev_hash   text not null,
  hash        text not null unique,
  kind        text not null check (kind in ('mint', 'reward', 'tip', 'transfer')),
  from_addr   text not null,
  to_addr     text not null references public.readnet_wallets (address),
  amount      bigint not null check (amount > 0),
  memo        text not null default '',
  ts          text not null,
  created_at  timestamptz not null default now()
);
create index if not exists readnet_blocks_from_idx on public.readnet_blocks (from_addr, height desc);
create index if not exists readnet_blocks_to_idx on public.readnet_blocks (to_addr, height desc);

create table if not exists public.readnet_reward_claims (
  user_id     uuid not null references auth.users (id) on delete cascade,
  book_id     text not null,
  chapter     int  not null,
  amount      bigint not null,
  claimed_at  timestamptz not null default now(),
  primary key (user_id, book_id, chapter)
);
create index if not exists readnet_claims_user_time_idx on public.readnet_reward_claims (user_id, claimed_at desc);

-- ── Row level security ─────────────────────────────────────────────────────
-- The ledger is public to signed-in users (like a block explorer); wallets and
-- claims are visible to their owner only. No insert/update/delete policies:
-- writes happen exclusively inside the functions below.

alter table public.readnet_wallets enable row level security;
alter table public.readnet_blocks enable row level security;
alter table public.readnet_reward_claims enable row level security;

drop policy if exists "readnet wallets: owner reads" on public.readnet_wallets;
create policy "readnet wallets: owner reads" on public.readnet_wallets
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "readnet blocks: signed-in users read" on public.readnet_blocks;
create policy "readnet blocks: signed-in users read" on public.readnet_blocks
  for select to authenticated using (true);

drop policy if exists "readnet claims: owner reads" on public.readnet_reward_claims;
create policy "readnet claims: owner reads" on public.readnet_reward_claims
  for select to authenticated using (user_id = auth.uid());

-- ── Constants & helpers ────────────────────────────────────────────────────

create or replace function public.readnet_const(name text)
returns bigint language sql immutable as $$
  select case name
    when 'welcome_bonus'    then 50
    when 'chapter_reward'   then 5
    when 'daily_reward_cap' then 50
    when 'reward_cooldown'  then 20
    when 'min_transfer'     then 1
    when 'max_transfer'     then 10000
  end
$$;

create or replace function public.readnet_sha256(input text)
returns text language sql immutable as $$
  select encode(extensions.digest(convert_to(input, 'UTF8'), 'sha256'), 'hex')
$$;

create or replace function public.readnet_user_address(uid uuid)
returns text language sql immutable as $$
  select 'rdm1' || left(public.readnet_sha256(uid::text), 38)
$$;

create or replace function public.readnet_author_key(name text)
returns text language sql immutable as $$
  select lower(regexp_replace(btrim(name), '\s+', '-', 'g'))
$$;

create or replace function public.readnet_author_address(name text)
returns text language sql immutable as $$
  select 'rdm1' || left(public.readnet_sha256('author:' || public.readnet_author_key(name)), 38)
$$;

-- Appends one block, moving `amount` from `p_from` to `p_to`. Caller must hold
-- the ledger lock and have validated balances.
create or replace function public.readnet_append(
  p_kind text, p_from text, p_to text, p_amount bigint, p_memo text
) returns public.readnet_blocks
language plpgsql security definer set search_path = public as $$
declare
  head public.readnet_blocks;
  b    public.readnet_blocks;
begin
  select * into head from public.readnet_blocks order by height desc limit 1;
  b.height    := coalesce(head.height + 1, 0);
  b.prev_hash := coalesce(head.hash, repeat('0', 64));
  b.kind      := p_kind;
  b.from_addr := p_from;
  b.to_addr   := p_to;
  b.amount    := p_amount;
  b.memo      := coalesce(p_memo, '');
  b.ts        := to_char(clock_timestamp() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
  b.hash      := public.readnet_sha256(concat_ws('|',
                   b.height, b.prev_hash, b.kind, b.from_addr, b.to_addr, b.amount, b.memo, b.ts));
  b.created_at := now();

  insert into public.readnet_blocks values (b.*);
  if p_from <> 'rdm1network0000000000000000000000000000000' then
    update public.readnet_wallets set balance = balance - p_amount where address = p_from;
  end if;
  update public.readnet_wallets set balance = balance + p_amount where address = p_to;
  return b;
end $$;

create or replace function public.readnet_lock()
returns void language sql as $$
  select pg_advisory_xact_lock(hashtext('readnet_ledger'))
$$;

create or replace function public.readnet_block_json(b public.readnet_blocks)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'height', b.height, 'prevHash', b.prev_hash, 'hash', b.hash, 'kind', b.kind,
    'from', b.from_addr, 'to', b.to_addr, 'amount', b.amount, 'memo', b.memo, 'ts', b.ts)
$$;

-- Ensures the caller's wallet exists (crediting the welcome bonus). Caller
-- must hold the ledger lock. Returns the address.
create or replace function public.readnet_ensure_wallet(uid uuid)
returns text language plpgsql security definer set search_path = public as $$
declare
  addr text := public.readnet_user_address(uid);
begin
  if not exists (select 1 from public.readnet_wallets where address = addr) then
    insert into public.readnet_wallets (address, user_id) values (addr, uid);
    perform public.readnet_append('mint', 'rdm1network0000000000000000000000000000000', addr,
                                  public.readnet_const('welcome_bonus'), 'welcome');
  end if;
  return addr;
end $$;

-- ── Public API (called via supabase.rpc) ───────────────────────────────────

create or replace function public.readnet_open_wallet()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  uid  uuid := auth.uid();
  addr text;
  w    public.readnet_wallets;
begin
  if uid is null then raise exception 'readnet:no_wallet'; end if;
  perform public.readnet_lock();
  addr := public.readnet_ensure_wallet(uid);
  select * into w from public.readnet_wallets where address = addr;
  return jsonb_build_object('address', w.address, 'balance', w.balance, 'createdAt', w.created_at);
end $$;

create or replace function public.readnet_claim_reward(p_book_id text, p_chapter int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  uid    uuid := auth.uid();
  addr   text;
  last   timestamptz;
  today  bigint;
  amt    bigint;
  b      public.readnet_blocks;
begin
  if uid is null then raise exception 'readnet:no_wallet'; end if;
  perform public.readnet_lock();
  addr := public.readnet_ensure_wallet(uid);

  if exists (select 1 from public.readnet_reward_claims
             where user_id = uid and book_id = p_book_id and chapter = p_chapter) then
    raise exception 'readnet:already_claimed';
  end if;

  select max(claimed_at) into last from public.readnet_reward_claims where user_id = uid;
  if last is not null and now() - last < make_interval(secs => public.readnet_const('reward_cooldown')) then
    raise exception 'readnet:cooldown';
  end if;

  select coalesce(sum(amount), 0) into today from public.readnet_reward_claims
   where user_id = uid and claimed_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc';
  amt := least(public.readnet_const('chapter_reward'), public.readnet_const('daily_reward_cap') - today);
  if amt <= 0 then raise exception 'readnet:daily_cap'; end if;

  insert into public.readnet_reward_claims (user_id, book_id, chapter, amount)
  values (uid, p_book_id, p_chapter, amt);
  b := public.readnet_append('reward', 'rdm1network0000000000000000000000000000000', addr, amt,
                             'read:' || p_book_id || '#' || p_chapter);
  return public.readnet_block_json(b);
end $$;

create or replace function public.readnet_transfer(p_to text, p_amount bigint, p_memo text default '')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  uid  uuid := auth.uid();
  addr text;
  bal  bigint;
  b    public.readnet_blocks;
begin
  if uid is null then raise exception 'readnet:no_wallet'; end if;
  if p_amount is null or p_amount < public.readnet_const('min_transfer')
     or p_amount > public.readnet_const('max_transfer') then
    raise exception 'readnet:invalid_amount';
  end if;
  perform public.readnet_lock();
  addr := public.readnet_ensure_wallet(uid);
  if btrim(p_to) = addr then raise exception 'readnet:self_transfer'; end if;
  if not exists (select 1 from public.readnet_wallets where address = btrim(p_to)) then
    raise exception 'readnet:unknown_address';
  end if;
  select balance into bal from public.readnet_wallets where address = addr;
  if bal < p_amount then raise exception 'readnet:insufficient_funds'; end if;
  b := public.readnet_append('transfer', addr, btrim(p_to), p_amount, left(coalesce(p_memo, ''), 140));
  return public.readnet_block_json(b);
end $$;

create or replace function public.readnet_tip_author(p_author text, p_book_id text, p_amount bigint)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  uid    uuid := auth.uid();
  addr   text;
  target text := public.readnet_author_address(p_author);
  bal    bigint;
  b      public.readnet_blocks;
begin
  if uid is null then raise exception 'readnet:no_wallet'; end if;
  if p_amount is null or p_amount < public.readnet_const('min_transfer')
     or p_amount > public.readnet_const('max_transfer') then
    raise exception 'readnet:invalid_amount';
  end if;
  perform public.readnet_lock();
  addr := public.readnet_ensure_wallet(uid);
  select balance into bal from public.readnet_wallets where address = addr;
  if bal < p_amount then raise exception 'readnet:insufficient_funds'; end if;
  insert into public.readnet_wallets (address, author_key)
  values (target, public.readnet_author_key(p_author))
  on conflict (address) do nothing;
  b := public.readnet_append('tip', addr, target, p_amount, 'tip:' || p_book_id);
  return public.readnet_block_json(b);
end $$;

create or replace function public.readnet_stats()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'height',   coalesce((select max(height) from public.readnet_blocks), -1),
    'supply',   coalesce((select sum(amount) from public.readnet_blocks
                          where from_addr = 'rdm1network0000000000000000000000000000000'), 0),
    'wallets',  (select count(*) from public.readnet_wallets),
    'headHash', coalesce((select hash from public.readnet_blocks order by height desc limit 1), repeat('0', 64)))
$$;

-- Only the public API is callable by clients; helpers stay internal.
revoke all on function public.readnet_append(text, text, text, bigint, text) from public, anon, authenticated;
revoke all on function public.readnet_ensure_wallet(uuid) from public, anon, authenticated;
revoke all on function public.readnet_open_wallet() from public, anon;
revoke all on function public.readnet_claim_reward(text, int) from public, anon;
revoke all on function public.readnet_transfer(text, bigint, text) from public, anon;
revoke all on function public.readnet_tip_author(text, text, bigint) from public, anon;
revoke all on function public.readnet_stats() from public, anon;
grant execute on function public.readnet_open_wallet() to authenticated;
grant execute on function public.readnet_claim_reward(text, int) to authenticated;
grant execute on function public.readnet_transfer(text, bigint, text) to authenticated;
grant execute on function public.readnet_tip_author(text, text, bigint) to authenticated;
grant execute on function public.readnet_stats() to authenticated;
