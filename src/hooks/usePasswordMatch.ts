import { useMemo } from 'react';

export type MatchStatus =
  | { state: 'idle' }
  | { state: 'match' }
  | { state: 'mismatch' };

// Pure, synchronous helper: true only when both fields are non-empty and equal.
export function passwordsMatch(password: string, confirm: string): boolean {
  return Boolean(password) && Boolean(confirm) && password === confirm;
}

// Reports whether two password fields match. Stays `idle` until the user has
// typed something into the confirm field so the form doesn't flash an error on
// an empty input.
export function usePasswordMatch(password: string, confirm: string): MatchStatus {
  return useMemo<MatchStatus>(() => {
    if (!confirm) {
      return { state: 'idle' };
    }
    return passwordsMatch(password, confirm)
      ? { state: 'match' }
      : { state: 'mismatch' };
  }, [password, confirm]);
}
