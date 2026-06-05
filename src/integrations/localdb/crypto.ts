// Password hashing for the local database.
//
// Even on a device-only store we never keep plaintext passwords. We derive a
// key with PBKDF2-SHA256 over a per-user random salt; the salt and digest are
// stored as hex. This is not a replacement for a server's auth, just enough to
// avoid round-tripping raw passwords through IndexedDB.

const ITERATIONS = 100_000;
const KEY_BITS = 256;
const SALT_BYTES = 16;

const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function deriveHash(password: string, salt: Uint8Array): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    KEY_BITS,
  );
  return bytesToHex(new Uint8Array(bits));
}

export interface PasswordHash {
  salt: string;
  hash: string;
}

export async function hashPassword(password: string): Promise<PasswordHash> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await deriveHash(password, salt);
  return { salt: bytesToHex(salt), hash };
}

// Re-derive with the stored salt and compare in constant time.
export async function verifyPassword(password: string, stored: PasswordHash): Promise<boolean> {
  const candidate = await deriveHash(password, hexToBytes(stored.salt));
  if (candidate.length !== stored.hash.length) return false;
  let mismatch = 0;
  for (let i = 0; i < candidate.length; i += 1) {
    mismatch |= candidate.charCodeAt(i) ^ stored.hash.charCodeAt(i);
  }
  return mismatch === 0;
}
