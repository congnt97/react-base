import { queryOptions, useQuery } from '@tanstack/react-query';

import type { AuthRepository } from '@/application/repositories/AuthRepository';
import { useRepository } from '@/di/RepositoriesProvider';
import { Endpoints } from '@/shared/endpoints';

export const getMeQueryOptions = (authRepository: AuthRepository) =>
  queryOptions({
    queryKey: [Endpoints.Auth.ME],
    queryFn: authRepository.me,
    retry: false,
  });

export function useMe({ enabled = true }: { enabled?: boolean } = {}) {
  const { authRepository } = useRepository();

  return useQuery({
    ...getMeQueryOptions(authRepository),
    enabled,
  });
}
