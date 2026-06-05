// Checks a password against the "Have I Been Pwned" Pwned Passwords database
// using k-anonymity: the password is SHA-1 hashed locally and only the first
// 5 hex characters of the hash are ever sent over the network. The full
// password (and even its full hash) never leaves the device.
// Docs: https://haveibeenpwned.com/API/v3#PwnedPasswords

const HIBP_RANGE_URL = 'https://api.pwnedpasswords.com/range/';

// SHA-1 hex digest (uppercase) via the Web Crypto API.
async function sha1HexUpper(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

// Returns how many times the password appears in known breaches (0 = not found).
export async function getPasswordBreachCount(
  password: string,
  signal?: AbortSignal,
): Promise<number> {
  if (!password) return 0;

  const hash = await sha1HexUpper(password);
  const prefix = hash.slice(0, 5); // only this leaves the device
  const suffix = hash.slice(5);

  const res = await fetch(`${HIBP_RANGE_URL}${prefix}`, {
    // Add-Padding returns extra dummy records so the response size can't hint
    // at how many real matches the prefix has.
    headers: { 'Add-Padding': 'true' },
    signal,
  });
  if (!res.ok) throw new Error(`Pwned Passwords request failed: ${res.status}`);

  const body = await res.text();
  for (const line of body.split('\n')) {
    const [hashSuffix, countStr] = line.trim().split(':');
    if (hashSuffix === suffix) {
      const count = Number.parseInt(countStr, 10);
      return Number.isFinite(count) ? count : 0;
    }
  }
  return 0;
}
