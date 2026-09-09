import { useInfiniteQuery } from '@tanstack/react-query';

import { dashboardApi } from '@/features/dashboard/api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  activity: () => [...dashboardKeys.all, 'activity'] as const,
};

/**
 * Mẫu infinite list theo cursor: server trả `nextCursor`, null là hết.
 * Dùng `data.pages.flatMap(p => p.items)` để render, `fetchNextPage` khi bấm "Tải thêm".
 */
export function useActivity() {
  return useInfiniteQuery({
    queryKey: dashboardKeys.activity(),
    queryFn: ({ pageParam }) =>
      dashboardApi.activity({ cursor: pageParam, limit: 10 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
