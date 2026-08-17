import { queryOptions } from '@tanstack/react-query';

import type { AuthRepository } from '@/application/repositories/AuthRepository';
import { useApiQuery } from '@/infrastructure/hooks/useApi';
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

  return useApiQuery({
    queryKey: [Endpoints.Auth.ME],
    queryFn: authRepository.me,
    options: {
      enabled,
      retry: false,
    },
  });
}
