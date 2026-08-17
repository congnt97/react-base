import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

import { useRepository } from '@/di/RepositoriesProvider';
import { useApiMutation } from '@/infrastructure/hooks/useApi';
import { useAuthStore } from '@/presentation/stores/useAuthStore';

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authRepository } = useRepository();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useApiMutation<void, void>({
    mutationFn: authRepository.logout,
    options: {
      onSettled: () => {
        clearAuth();
        queryClient.clear();
        void navigate({
          to: '/auth/login',
          search: { redirectTo: undefined },
          replace: true,
        });
      },
    },
  });
}
