import { useEffect, useRef, useState } from 'react';

import { useDebouncedCallback } from '@/core/hooks/use-debounced-callback';

type AsyncOptionsState<TOption> = {
  options: TOption[];
  loading: boolean;
  error: unknown;
};

type UseAsyncOptionsConfig = {
  /** How long to wait after typing stops before calling. */
  delay?: number;
  /** Shorter than this, don't call, return empty options. */
  minLength?: number;
};

/**
 * Searches for options from the server for a select: debounces, cancels the previous
 * request, and discards a stale response that arrives after a newer one. The adapter only
 * needs to wire up `onSearch`, `options`, `loading`.
 */
export function useAsyncOptions<TOption>(
  search: (keyword: string, signal: AbortSignal) => Promise<TOption[]>,
  { delay = 300, minLength = 0 }: UseAsyncOptionsConfig = {},
) {
  const [state, setState] = useState<AsyncOptionsState<TOption>>({
    options: [],
    loading: false,
    error: null,
  });
  const controllerRef = useRef<AbortController | null>(null);

  const run = async (keyword: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (keyword.length < minLength) {
      setState({ options: [], loading: false, error: null });
      return;
    }

    setState((previous) => ({ ...previous, loading: true }));
    try {
      const options = await search(keyword, controller.signal);
      // The request has been superseded by a later keystroke: discard it, don't overwrite newer results.
      if (!controller.signal.aborted) {
        setState({ options, loading: false, error: null });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setState((previous) => ({ ...previous, loading: false, error }));
      }
    }
  };

  const debouncedRun = useDebouncedCallback((keyword: string) => {
    void run(keyword);
  }, delay);

  // On unmount, cancel any in-flight request so state isn't set afterward.
  useEffect(() => () => controllerRef.current?.abort(), []);

  return { ...state, onSearch: debouncedRun };
}
