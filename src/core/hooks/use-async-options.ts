import { useEffect, useRef, useState } from 'react';

import { useDebouncedCallback } from '@/core/hooks/use-debounced-callback';

type AsyncOptionsState<TOption> = {
  options: TOption[];
  loading: boolean;
  error: unknown;
};

type UseAsyncOptionsConfig = {
  /** Chờ ngừng gõ bao lâu mới gọi. */
  delay?: number;
  /** Ngắn hơn thì không gọi, trả options rỗng. */
  minLength?: number;
};

/**
 * Tìm option từ server cho select: debounce, huỷ request cũ, bỏ response cũ về
 * sau response mới. Adapter chỉ cần nối `onSearch`, `options`, `loading`.
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
      // Request đã bị thay bởi lần gõ sau: bỏ, không đè kết quả mới.
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

  // Unmount thì huỷ request đang bay để không set state sau đó.
  useEffect(() => () => controllerRef.current?.abort(), []);

  return { ...state, onSearch: debouncedRun };
}
