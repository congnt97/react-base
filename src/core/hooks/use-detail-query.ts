import { useQuery, type QueryKey } from '@tanstack/react-query';

type DetailQueryOptions<TData> = {
  queryKey: QueryKey;
  queryFn: (context: { signal: AbortSignal }) => Promise<TData>;
  /** Disabled when there's no id yet; the hook won't get stuck in loading. */
  enabled?: boolean;
};

/** Normalized detail query: `isLoading` means what it says, `signal` is available, never stuck when disabled. */
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
