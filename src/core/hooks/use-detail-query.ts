import { useQuery, type QueryKey } from '@tanstack/react-query';

type DetailQueryOptions<TData> = {
  queryKey: QueryKey;
  queryFn: (context: { signal: AbortSignal }) => Promise<TData>;
  /** Chưa có id thì tắt; hook không kẹt loading. */
  enabled?: boolean;
};

/** Detail query chuẩn hoá: `isLoading` đúng nghĩa, `signal` sẵn, không kẹt khi tắt. */
export function useDetailQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
}: DetailQueryOptions<TData>) {
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => queryFn({ signal }),
    enabled,
  });

  return {
    data: query.data,
    isLoading: query.isPending && query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}
