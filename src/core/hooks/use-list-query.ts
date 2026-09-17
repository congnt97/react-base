import {
  keepPreviousData,
  useQuery,
  type QueryKey,
} from '@tanstack/react-query';
import { useEffect, useEffectEvent } from 'react';

import type { ListState } from '@/core/contracts';
import type { PaginatedResponse } from '@/lib/api-response';

type ListQueryOptions<TItem> = {
  queryKey: QueryKey;
  queryFn: (context: {
    signal: AbortSignal;
  }) => Promise<PaginatedResponse<TItem>>;
  enabled?: boolean;
  /** The page and page size currently shown, to detect page overflow. */
  page: number;
  pageSize: number;
  /**
   * Called when the current page is empty but data still exists (typically after deleting
   * the last row of the last page). Receives the nearest valid page number to navigate to.
   */
  onPageOverflow?: (lastPage: number) => void;
};

/**
 * List query normalized for any table library:
 * - `isLoading` is true only while actually loading for the first time; `enabled: false`
 *   doesn't get stuck in loading.
 * - Keeps old data when the page/filter changes (`keepPreviousData`) so the table doesn't flicker.
 * - Cancels the previous request via `signal`.
 * - Detects page overflow itself and reports it back so the caller can go to an earlier page.
 */
export function useListQuery<TItem>({
  queryKey,
  queryFn,
  enabled = true,
  page,
  pageSize,
  onPageOverflow,
}: ListQueryOptions<TItem>): ListState<TItem> {
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => queryFn({ signal }),
    enabled,
    placeholderData: keepPreviousData,
  });

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const isOverflow =
    query.isSuccess &&
    !query.isPlaceholderData &&
    items.length === 0 &&
    total > 0 &&
    page > 1;

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  // useEffectEvent: reads the latest callback without putting it in deps, so it only
  // notifies once per overflow detection even if the caller passes an inline callback.
  const notifyOverflow = useEffectEvent((page: number) =>
    onPageOverflow?.(page),
  );

  // Syncs with external URL/state when page overflow is detected, so this is a valid effect.
  useEffect(() => {
    if (isOverflow) {
      notifyOverflow(lastPage);
    }
  }, [isOverflow, lastPage]);

  return {
    items,
    total,
    // TanStack v5: isPending is true even when the query is disabled; isFetching is the real loading signal.
    isLoading: query.isPending && query.isFetching,
    isRefreshing: query.isFetching && query.isPlaceholderData,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}
