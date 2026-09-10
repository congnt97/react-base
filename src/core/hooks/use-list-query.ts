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
  /** Trang và cỡ trang đang hiển thị, để phát hiện trang tràn. */
  page: number;
  pageSize: number;
  /**
   * Gọi khi trang hiện tại trống nhưng vẫn còn dữ liệu (thường sau khi xoá dòng cuối
   * của trang cuối). Nhận số trang hợp lệ gần nhất để điều hướng.
   */
  onPageOverflow?: (lastPage: number) => void;
};

/**
 * List query đã chuẩn hoá cho mọi thư viện bảng:
 * - `isLoading` chỉ true khi thật sự tải lần đầu; `enabled: false` không kẹt loading.
 * - Giữ data cũ khi đổi trang/filter (`keepPreviousData`) để bảng không nháy.
 * - Huỷ request cũ qua `signal`.
 * - Tự phát hiện trang tràn và báo về để lùi trang.
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
  // useEffectEvent: đọc callback mới nhất mà không đưa vào deps, nên chỉ báo một lần
  // mỗi lần phát hiện tràn dù page truyền callback inline.
  const notifyOverflow = useEffectEvent((page: number) =>
    onPageOverflow?.(page),
  );

  // Đồng bộ với URL/state bên ngoài khi phát hiện trang tràn, nên là effect hợp lệ.
  useEffect(() => {
    if (isOverflow) {
      notifyOverflow(lastPage);
    }
  }, [isOverflow, lastPage]);

  return {
    items,
    total,
    // TanStack v5: isPending true cả khi query tắt; isFetching mới là đang tải thật.
    isLoading: query.isPending && query.isFetching,
    isRefreshing: query.isFetching && query.isPlaceholderData,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}
