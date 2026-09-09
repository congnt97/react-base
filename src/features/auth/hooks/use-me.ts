import { queryOptions, useQuery } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export const meQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    retry: false,
  });

export function useMe({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({ ...meQueryOptions(), enabled });
}
