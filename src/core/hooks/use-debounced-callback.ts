import { useEffect, useRef } from 'react';

/**
 * Returns a function that calls `delay` ms after the last call. Used for search inputs so
 * a request isn't fired on every keystroke. The timer is cleared on unmount so state isn't
 * set afterward.
 *
 * `callback` is kept in a ref: each call always uses the latest version without needing it
 * in the dependency array, so the returned function stays stable across renders.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 400,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (...args: TArgs) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
  };
}
