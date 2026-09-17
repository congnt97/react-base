import { useRef, useState } from 'react';

import type { AsyncAction } from '@/core/contracts';

/**
 * Wraps an async action to block click spam: a call made while it's already running is
 * skipped; `pending` lets the adapter bind to the button's `loading`.
 *
 * Uses a ref instead of state for the running flag, because state updates after render
 * while a second click can arrive before the render catches up.
 */
export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<unknown>,
): AsyncAction<TArgs> {
  const runningRef = useRef(false);
  const [pending, setPending] = useState(false);

  const run = async (...args: TArgs) => {
    if (runningRef.current) {
      return false;
    }
    runningRef.current = true;
    setPending(true);
    try {
      await action(...args);
      return true;
    } finally {
      runningRef.current = false;
      setPending(false);
    }
  };

  return { run, pending, isRunning: () => runningRef.current };
}
