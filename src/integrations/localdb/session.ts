// Tracks which local-database user is currently signed in.
//
// The account lives in IndexedDB; this just remembers the active email in
// localStorage so a refresh keeps the session.

import { findUser, type User } from './users';

const SESSION_KEY = 'readom.session.email';

export function startSession(user: User): void {
  localStorage.setItem(SESSION_KEY, user.email);
}

export function endSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Resolve the signed-in user from the stored email, or null if there's no
// session (or the account no longer exists).
export async function getCurrentUser(): Promise<User | null> {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  const user = await findUser(email);
  if (!user) {
    endSession();
    return null;
  }
  return user;
}
