import { describe, it, expect } from 'vitest';
import {
  CHAPTER_REWARD, DAILY_REWARD_CAP, GENESIS_PREV_HASH, NETWORK_ADDRESS, REWARD_COOLDOWN_SECONDS, WELCOME_BONUS,
  authorAddress, blockPayload, claimChapterReward, emptyState, ensureWallet, isAddress, networkStats,
  sha256Hex, tipAuthor, transfer, userAddress, verifyChain, NetworkError, type ChainState,
} from './engine';

const ALICE = '11111111-1111-4111-8111-111111111111';
const BOB = '22222222-2222-4222-8222-222222222222';
const t0 = new Date('2026-11-09T10:00:00.000Z');
const at = (sec: number) => new Date(t0.getTime() + sec * 1000);

const code = async (p: Promise<unknown>) => {
  try { await p; return null; } catch (e) { return (e as NetworkError).code; }
};

describe('readnet engine', () => {
  it('derives stable rdm1 addresses', async () => {
    const a = await userAddress(ALICE);
    expect(isAddress(a)).toBe(true);
    expect(a).toBe(await userAddress(ALICE));
    expect(a).not.toBe(await userAddress(BOB));
    expect(await authorAddress('  Мэтт  Хейг ')).toBe(await authorAddress('мэтт хейг'));
  });

  it('hashes the canonical payload with sha256', async () => {
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(blockPayload({ height: 0, prevHash: 'p', kind: 'mint', from: 'f', to: 't', amount: 5, memo: 'm', ts: 'x' }))
      .toBe('0|p|mint|f|t|5|m|x');
  });

  it('opens a wallet once with the welcome bonus', async () => {
    const opened = await ensureWallet(emptyState(), ALICE, t0);
    let { state } = opened;
    expect(opened.wallet.balance).toBe(WELCOME_BONUS);
    expect(state.blocks).toHaveLength(1);
    expect(state.blocks[0]).toMatchObject({ height: 0, prevHash: GENESIS_PREV_HASH, kind: 'mint', from: NETWORK_ADDRESS });
    ({ state } = await ensureWallet(state, ALICE, at(1)));
    expect(state.blocks).toHaveLength(1);
  });

  it('rewards each chapter once, with cooldown and a daily cap', async () => {
    let s: ChainState = emptyState();
    ({ state: s } = await claimChapterReward(s, ALICE, 'b1', 0, t0));
    expect(s.wallets[await userAddress(ALICE)].balance).toBe(WELCOME_BONUS + CHAPTER_REWARD);

    expect(await code(claimChapterReward(s, ALICE, 'b1', 0, at(60)))).toBe('already_claimed');
    expect(await code(claimChapterReward(s, ALICE, 'b1', 1, at(REWARD_COOLDOWN_SECONDS - 1)))).toBe('cooldown');

    const perDay = DAILY_REWARD_CAP / CHAPTER_REWARD;
    for (let i = 1; i < perDay; i += 1) {
      ({ state: s } = await claimChapterReward(s, ALICE, 'b1', i, at(i * 60)));
    }
    expect(await code(claimChapterReward(s, ALICE, 'b2', 0, at(perDay * 60)))).toBe('daily_cap');
    // Next UTC day the cap resets.
    ({ state: s } = await claimChapterReward(s, ALICE, 'b2', 0, new Date('2026-11-10T00:00:05.000Z')));
    expect(s.wallets[await userAddress(ALICE)].balance).toBe(WELCOME_BONUS + DAILY_REWARD_CAP + CHAPTER_REWARD);
  });

  it('transfers between wallets and validates input', async () => {
    let s = (await ensureWallet(emptyState(), ALICE, t0)).state;
    s = (await ensureWallet(s, BOB, at(1))).state;
    const bob = await userAddress(BOB);

    expect(await code(transfer(s, ALICE, bob, 0, '', at(2)))).toBe('invalid_amount');
    expect(await code(transfer(s, ALICE, bob, 1.5, '', at(2)))).toBe('invalid_amount');
    expect(await code(transfer(s, ALICE, bob, WELCOME_BONUS + 1, '', at(2)))).toBe('insufficient_funds');
    expect(await code(transfer(s, ALICE, await userAddress(ALICE), 1, '', at(2)))).toBe('self_transfer');
    expect(await code(transfer(s, ALICE, 'rdm1' + 'a'.repeat(38), 1, '', at(2)))).toBe('unknown_address');

    ({ state: s } = await transfer(s, ALICE, bob, 20, 'thanks', at(3)));
    expect(s.wallets[await userAddress(ALICE)].balance).toBe(WELCOME_BONUS - 20);
    expect(s.wallets[bob].balance).toBe(WELCOME_BONUS + 20);
  });

  it('tips land in the author wallet and supply is conserved', async () => {
    let s = (await ensureWallet(emptyState(), ALICE, t0)).state;
    ({ state: s } = await tipAuthor(s, ALICE, 'Мэтт Хейг', 'b1', 10, at(1)));
    const author = s.wallets[await authorAddress('Мэтт Хейг')];
    expect(author).toMatchObject({ balance: 10, userId: null, authorKey: 'мэтт-хейг' });

    const stats = networkStats(s);
    const total = Object.values(s.wallets).reduce((sum, w) => sum + w.balance, 0);
    expect(total).toBe(stats.supply);
    expect(stats.height).toBe(1);
  });

  it('verifies the chain and detects tampering', async () => {
    let s = (await ensureWallet(emptyState(), ALICE, t0)).state;
    s = (await ensureWallet(s, BOB, at(1))).state;
    ({ state: s } = await transfer(s, ALICE, await userAddress(BOB), 5, '', at(2)));
    expect(await verifyChain(s.blocks)).toEqual({ ok: true, checked: 3 });
    // A window of recent blocks verifies on its own too.
    expect((await verifyChain(s.blocks.slice(1))).ok).toBe(true);

    const tampered = s.blocks.map((b) => ({ ...b }));
    tampered[1].amount = 5000;
    expect(await verifyChain(tampered)).toMatchObject({ ok: false, brokenAt: 1 });
  });

  it('does not mutate the input state', async () => {
    const s0 = (await ensureWallet(emptyState(), ALICE, t0)).state;
    const snapshot = JSON.stringify(s0);
    await claimChapterReward(s0, ALICE, 'b1', 0, at(1));
    expect(JSON.stringify(s0)).toBe(snapshot);
  });
});
