import { useEffect, useState } from 'react';
import { getPasswordBreachCount } from '@/lib/passwordBreach';

export type BreachStatus =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'safe' }
  | { state: 'breached'; count: number }
  | { state: 'error' };

// Debounced breach lookup. Only runs when `enabled` is true (e.g. the password
// already satisfies the local rules) to avoid hitting the API on every
// keystroke of an obviously-incomplete password.
export function usePasswordBreach(password: string, enabled: boolean, delay = 500): BreachStatus {
  const [status, setStatus] = useState<BreachStatus>({ state: 'idle' });

  useEffect(() => {
    if (!enabled || !password) {
      setStatus({ state: 'idle' });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus({ state: 'checking' });
      try {
        const count = await getPasswordBreachCount(password, controller.signal);
        setStatus(count > 0 ? { state: 'breached', count } : { state: 'safe' });
      } catch (err) {
        if (controller.signal.aborted) return; // superseded by a newer check
        setStatus({ state: 'error' });
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [password, enabled, delay]);

  return status;
}
