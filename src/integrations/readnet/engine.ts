// READOM Network — core ledger rules.
//
// The READ token runs on an off-chain, hash-chained ledger: every balance
// change is a "block" whose hash covers its contents and the previous block's
// hash, so tampering with any historical entry breaks every hash after it.
// That makes the ledger auditable today and easy to anchor on a public chain
// later (publish the head hash, or mint the balances as an ERC-20/Jetton).
//
// This module is pure: it takes a `ChainState`, applies one operation and
// returns the new state. The local (IndexedDB) backend persists that state;
// the Supabase backend enforces the *same* rules in SQL
// (supabase/migrations/*_readom_network.sql). Keep the two in sync — the
// constants and the hash payload format below are the contract.

export const TOKEN_SYMBOL = 'READ';
export const NETWORK_ADDRESS = 'rdm1network0000000000000000000000000000000';
export const GENESIS_PREV_HASH = '0'.repeat(64);

/** One-time welcome grant credited when a wallet is first opened. */
export const WELCOME_BONUS = 50;
/** Reward for finishing a chapter (once per user × book × chapter). */
export const CHAPTER_REWARD = 5;
/** Max READ a user can earn from reading per UTC day. */
export const DAILY_REWARD_CAP = 50;
/** Minimum seconds between two reading rewards — slows down farming. */
export const REWARD_COOLDOWN_SECONDS = 20;
/** Bounds for a single tip / transfer. */
export const MIN_TRANSFER = 1;
export const MAX_TRANSFER = 10_000;

export type BlockKind = 'mint' | 'reward' | 'tip' | 'transfer';

export interface Block {
  height: number;
  prevHash: string;
  hash: string;
  kind: BlockKind;
  from: string;
  to: string;
  /** Whole READ units. */
  amount: number;
  memo: string;
  /** ISO-8601 UTC with milliseconds (Date#toISOString format). */
  ts: string;
}

export interface Wallet {
  address: string;
  /** Owning user id, or null for author escrow wallets. */
  userId: string | null;
  /** Author key for author wallets (tips land here), else null. */
  authorKey: string | null;
  balance: number;
  createdAt: string;
}

export interface RewardClaim {
  userId: string;
  bookId: string;
  chapter: number;
  amount: number;
  ts: string;
}

export interface ChainState {
  wallets: Record<string, Wallet>;
  blocks: Block[];
  claims: RewardClaim[];
}

export class NetworkError extends Error {
  constructor(
    public code:
      | 'invalid_amount'
      | 'insufficient_funds'
      | 'unknown_address'
      | 'self_transfer'
      | 'already_claimed'
      | 'daily_cap'
      | 'cooldown'
      | 'no_wallet',
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'NetworkError';
  }
}

export const emptyState = (): ChainState => ({ wallets: {}, blocks: [], claims: [] });

// ── Hashing ────────────────────────────────────────────────────────────────

const encoder = new TextEncoder();

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(input));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Canonical payload hashed for a block. Mirrored by `readnet_block_payload` in SQL. */
export function blockPayload(b: Omit<Block, 'hash'>): string {
  return [b.height, b.prevHash, b.kind, b.from, b.to, b.amount, b.memo, b.ts].join('|');
}

export const hashBlock = (b: Omit<Block, 'hash'>) => sha256Hex(blockPayload(b));

/** Address of a user's wallet: `rdm1` + first 38 hex chars of sha256(user id). */
export async function userAddress(userId: string): Promise<string> {
  return 'rdm1' + (await sha256Hex(userId)).slice(0, 38);
}

/** Normalises an author name into a stable key ("Мэтт Хейг" → "мэтт-хейг"). */
export function authorKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

export async function authorAddress(name: string): Promise<string> {
  return 'rdm1' + (await sha256Hex('author:' + authorKey(name))).slice(0, 38);
}

export const isAddress = (s: string) => /^rdm1[0-9a-f]{38}$/.test(s.trim());

// ── Verification ───────────────────────────────────────────────────────────

export interface VerifyResult {
  ok: boolean;
  checked: number;
  /** Height of the first block that fails, if any. */
  brokenAt?: number;
}

/** Re-hashes the chain and checks each link. Blocks must be in height order. */
export async function verifyChain(blocks: Block[]): Promise<VerifyResult> {
  let prev = blocks.length && blocks[0].height > 0 ? blocks[0].prevHash : GENESIS_PREV_HASH;
  for (const b of blocks) {
    if (b.prevHash !== prev) return { ok: false, checked: b.height, brokenAt: b.height };
    const { hash, ...rest } = b;
    if ((await hashBlock(rest)) !== hash) return { ok: false, checked: b.height, brokenAt: b.height };
    prev = hash;
  }
  return { ok: true, checked: blocks.length };
}

// ── Operations ─────────────────────────────────────────────────────────────

const clone = (s: ChainState): ChainState => ({
  wallets: Object.fromEntries(Object.entries(s.wallets).map(([k, w]) => [k, { ...w }])),
  blocks: [...s.blocks],
  claims: [...s.claims],
});

async function appendBlock(
  s: ChainState,
  data: { kind: BlockKind; from: string; to: string; amount: number; memo: string },
  now: Date,
): Promise<Block> {
  const head = s.blocks[s.blocks.length - 1];
  const body = {
    height: head ? head.height + 1 : 0,
    prevHash: head ? head.hash : GENESIS_PREV_HASH,
    ...data,
    ts: now.toISOString(),
  };
  const block: Block = { ...body, hash: await hashBlock(body) };
  s.blocks.push(block);
  if (data.from !== NETWORK_ADDRESS) s.wallets[data.from].balance -= data.amount;
  s.wallets[data.to].balance += data.amount;
  return block;
}

/** Opens the user's wallet (crediting the welcome bonus) if it doesn't exist yet. */
export async function ensureWallet(state: ChainState, userId: string, now = new Date()) {
  const address = await userAddress(userId);
  if (state.wallets[address]) return { state, wallet: state.wallets[address] };
  const s = clone(state);
  s.wallets[address] = { address, userId, authorKey: null, balance: 0, createdAt: now.toISOString() };
  await appendBlock(s, { kind: 'mint', from: NETWORK_ADDRESS, to: address, amount: WELCOME_BONUS, memo: 'welcome' }, now);
  return { state: s, wallet: s.wallets[address] };
}

async function ensureAuthorWallet(s: ChainState, name: string, now: Date) {
  const address = await authorAddress(name);
  if (!s.wallets[address]) {
    s.wallets[address] = { address, userId: null, authorKey: authorKey(name), balance: 0, createdAt: now.toISOString() };
  }
  return address;
}

const utcDay = (iso: string) => iso.slice(0, 10);

/** Credits CHAPTER_REWARD for finishing a chapter, subject to dedupe, cooldown and daily cap. */
export async function claimChapterReward(
  state: ChainState,
  userId: string,
  bookId: string,
  chapter: number,
  now = new Date(),
) {
  const opened = await ensureWallet(state, userId, now);
  const s = clone(opened.state);
  const mine = s.claims.filter((c) => c.userId === userId);

  if (mine.some((c) => c.bookId === bookId && c.chapter === chapter)) throw new NetworkError('already_claimed');
  const last = mine[mine.length - 1];
  if (last && now.getTime() - Date.parse(last.ts) < REWARD_COOLDOWN_SECONDS * 1000) throw new NetworkError('cooldown');
  const today = utcDay(now.toISOString());
  const earnedToday = mine.filter((c) => utcDay(c.ts) === today).reduce((sum, c) => sum + c.amount, 0);
  const amount = Math.min(CHAPTER_REWARD, DAILY_REWARD_CAP - earnedToday);
  if (amount <= 0) throw new NetworkError('daily_cap');

  s.claims.push({ userId, bookId, chapter, amount, ts: now.toISOString() });
  const block = await appendBlock(
    s,
    { kind: 'reward', from: NETWORK_ADDRESS, to: opened.wallet.address, amount, memo: `read:${bookId}#${chapter}` },
    now,
  );
  return { state: s, block };
}

function checkAmount(amount: number) {
  if (!Number.isInteger(amount) || amount < MIN_TRANSFER || amount > MAX_TRANSFER) {
    throw new NetworkError('invalid_amount');
  }
}

/** Sends READ from the user's wallet to another address. */
export async function transfer(
  state: ChainState,
  userId: string,
  to: string,
  amount: number,
  memo = '',
  now = new Date(),
) {
  checkAmount(amount);
  const target = to.trim();
  const opened = await ensureWallet(state, userId, now);
  const s = clone(opened.state);
  const from = opened.wallet.address;
  if (target === from) throw new NetworkError('self_transfer');
  if (!s.wallets[target]) throw new NetworkError('unknown_address');
  if (s.wallets[from].balance < amount) throw new NetworkError('insufficient_funds');
  const block = await appendBlock(s, { kind: 'transfer', from, to: target, amount, memo: memo.slice(0, 140) }, now);
  return { state: s, block };
}

/** Tips a book's author. Tips accrue in the author's wallet until they claim it. */
export async function tipAuthor(
  state: ChainState,
  userId: string,
  author: string,
  bookId: string,
  amount: number,
  now = new Date(),
) {
  checkAmount(amount);
  const opened = await ensureWallet(state, userId, now);
  const s = clone(opened.state);
  const from = opened.wallet.address;
  if (s.wallets[from].balance < amount) throw new NetworkError('insufficient_funds');
  const to = await ensureAuthorWallet(s, author, now);
  const block = await appendBlock(s, { kind: 'tip', from, to, amount, memo: `tip:${bookId}` }, now);
  return { state: s, block };
}

/** Network-wide stats for the explorer. */
export function networkStats(state: ChainState) {
  const supply = state.blocks.filter((b) => b.from === NETWORK_ADDRESS).reduce((s, b) => s + b.amount, 0);
  return {
    height: state.blocks.length ? state.blocks[state.blocks.length - 1].height : -1,
    supply,
    wallets: Object.keys(state.wallets).length,
    headHash: state.blocks[state.blocks.length - 1]?.hash ?? GENESIS_PREV_HASH,
  };
}
