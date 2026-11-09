// READOM Network client.
//
// Two interchangeable backends implement the same API:
//   • `supabase` — the authoritative ledger (supabase/migrations/*_readom_network.sql),
//     shared by every user, rules enforced server-side.
//   • `local`    — the same engine running in the browser against IndexedDB, used
//     automatically while the migration hasn't been applied to the project yet,
//     so the feature is usable (per device) before the backend lands.

import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getRecord, putRecord } from '@/integrations/localdb/db';
import * as engine from './engine';
import { NetworkError, type Block, type ChainState } from './engine';

export interface WalletView {
  address: string;
  balance: number;
  createdAt: string;
}

export interface NetworkStats {
  height: number;
  supply: number;
  wallets: number;
  headHash: string;
}

export type NetworkMode = 'supabase' | 'local';

export interface ReadNetwork {
  mode: NetworkMode;
  openWallet(userId: string): Promise<WalletView>;
  history(userId: string, limit?: number): Promise<Block[]>;
  claimChapterReward(userId: string, bookId: string, chapter: number): Promise<Block>;
  transfer(userId: string, to: string, amount: number, memo?: string): Promise<Block>;
  tipAuthor(userId: string, author: string, bookId: string, amount: number): Promise<Block>;
  /** Latest blocks, oldest first. */
  latestBlocks(limit?: number): Promise<Block[]>;
  stats(): Promise<NetworkStats>;
}

// ── Local backend ──────────────────────────────────────────────────────────

const LOCAL_KEY = 'chain';

async function loadLocal(): Promise<ChainState> {
  const rec = await getRecord<{ id: string; state: ChainState }>('readnet', LOCAL_KEY);
  return rec?.state ?? engine.emptyState();
}

// Serialise writes so two quick actions can't fork the local chain.
let queue: Promise<unknown> = Promise.resolve();
function mutate<T>(fn: (s: ChainState) => Promise<{ state: ChainState; result: T }>): Promise<T> {
  const next = queue.then(async () => {
    const { state, result } = await fn(await loadLocal());
    await putRecord('readnet', { id: LOCAL_KEY, state });
    return result;
  });
  queue = next.catch(() => undefined);
  return next;
}

const toView = (w: engine.Wallet): WalletView => ({ address: w.address, balance: w.balance, createdAt: w.createdAt });

export const localNetwork: ReadNetwork = {
  mode: 'local',
  openWallet: (userId) =>
    mutate(async (s) => {
      const { state, wallet } = await engine.ensureWallet(s, userId);
      return { state, result: toView(wallet) };
    }),
  async history(userId, limit = 50) {
    const address = await engine.userAddress(userId);
    const s = await loadLocal();
    return s.blocks.filter((b) => b.from === address || b.to === address).slice(-limit).reverse();
  },
  claimChapterReward: (userId, bookId, chapter) =>
    mutate(async (s) => {
      const { state, block } = await engine.claimChapterReward(s, userId, bookId, chapter);
      return { state, result: block };
    }),
  transfer: (userId, to, amount, memo) =>
    mutate(async (s) => {
      const { state, block } = await engine.transfer(s, userId, to, amount, memo);
      return { state, result: block };
    }),
  tipAuthor: (userId, author, bookId, amount) =>
    mutate(async (s) => {
      const { state, block } = await engine.tipAuthor(s, userId, author, bookId, amount);
      return { state, result: block };
    }),
  async latestBlocks(limit = 20) {
    return (await loadLocal()).blocks.slice(-limit);
  },
  async stats() {
    return engine.networkStats(await loadLocal());
  },
};

// ── Supabase backend ───────────────────────────────────────────────────────

// The readnet tables/functions aren't in the generated `Database` type until the
// migration is applied and types are regenerated, so talk to them untyped.
const db = supabase as unknown as SupabaseClient;

interface BlockRow {
  height: number; prev_hash: string; hash: string; kind: engine.BlockKind;
  from_addr: string; to_addr: string; amount: number; memo: string; ts: string;
}

const fromRow = (r: BlockRow): Block => ({
  height: Number(r.height), prevHash: r.prev_hash, hash: r.hash, kind: r.kind,
  from: r.from_addr, to: r.to_addr, amount: Number(r.amount), memo: r.memo, ts: r.ts,
});

const ERROR_CODES = [
  'invalid_amount', 'insufficient_funds', 'unknown_address', 'self_transfer',
  'already_claimed', 'daily_cap', 'cooldown', 'no_wallet',
] as const;

function raise(error: { message?: string } | null): never {
  const msg = error?.message ?? 'Network request failed';
  const code = ERROR_CODES.find((c) => msg.includes(`readnet:${c}`));
  if (code) throw new NetworkError(code);
  throw new Error(msg);
}

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await db.rpc(fn, args);
  if (error) raise(error);
  return data as T;
}

const normBlock = (b: Block): Block => ({ ...b, height: Number(b.height), amount: Number(b.amount) });

export const supabaseNetwork: ReadNetwork = {
  mode: 'supabase',
  async openWallet() {
    const w = await rpc<WalletView>('readnet_open_wallet');
    return { ...w, balance: Number(w.balance) };
  },
  async history(userId, limit = 50) {
    const address = await engine.userAddress(userId);
    const { data, error } = await db
      .from('readnet_blocks')
      .select('*')
      .or(`from_addr.eq.${address},to_addr.eq.${address}`)
      .order('height', { ascending: false })
      .limit(limit);
    if (error) raise(error);
    return (data as BlockRow[]).map(fromRow);
  },
  claimChapterReward: async (_u, bookId, chapter) =>
    normBlock(await rpc<Block>('readnet_claim_reward', { p_book_id: bookId, p_chapter: chapter })),
  transfer: async (_u, to, amount, memo = '') =>
    normBlock(await rpc<Block>('readnet_transfer', { p_to: to.trim(), p_amount: amount, p_memo: memo })),
  tipAuthor: async (_u, author, bookId, amount) =>
    normBlock(await rpc<Block>('readnet_tip_author', { p_author: author, p_book_id: bookId, p_amount: amount })),
  async latestBlocks(limit = 20) {
    const { data, error } = await db
      .from('readnet_blocks')
      .select('*')
      .order('height', { ascending: false })
      .limit(limit);
    if (error) raise(error);
    return (data as BlockRow[]).map(fromRow).reverse();
  },
  async stats() {
    const s = await rpc<NetworkStats>('readnet_stats');
    return { ...s, height: Number(s.height), supply: Number(s.supply), wallets: Number(s.wallets) };
  },
};

// ── Backend selection ──────────────────────────────────────────────────────

let resolved: Promise<ReadNetwork> | null = null;

/** True when PostgREST reports that the readnet schema doesn't exist yet. */
function isMissingSchema(error: { code?: string; message?: string }) {
  return (
    error.code === 'PGRST202' || // function not found in schema cache
    error.code === 'PGRST205' || // table not found in schema cache
    error.code === '42883' ||
    error.code === '42P01' ||
    /could not find the function|does not exist|schema cache/i.test(error.message ?? '')
  );
}

/**
 * Picks the backend once per page load: Supabase if the readnet schema is
 * deployed, otherwise the local engine. Override with VITE_READNET_MODE.
 */
export function getNetwork(): Promise<ReadNetwork> {
  if (!resolved) {
    resolved = (async () => {
      const forced = import.meta.env.VITE_READNET_MODE as NetworkMode | undefined;
      if (forced === 'local') return localNetwork;
      if (forced === 'supabase') return supabaseNetwork;
      try {
        const { error } = await db.rpc('readnet_stats');
        if (!error) return supabaseNetwork;
        return isMissingSchema(error) ? localNetwork : supabaseNetwork;
      } catch {
        return localNetwork;
      }
    })();
  }
  return resolved;
}
