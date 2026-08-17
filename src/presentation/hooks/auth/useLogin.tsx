import { useNavigate, useSearch } from '@tanstack/react-router';
import { App } from 'antd';

import { getFormattedErrorMessage } from '@/application/dto/response/ErrorResponse';
import type { LoginRequest, LoginResponse } from '@/domain/models/Auth';
import { useRepository } from '@/di/RepositoriesProvider';
import { useApiMutation } from '@/infrastructure/hooks/useApi';
import { useAuthStore } from '@/presentation/stores/useAuthStore';

export function useLogin() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const search = useSearch({ from: '/auth/login' });
  const { authRepository } = useRepository();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useApiMutation<LoginRequest, LoginResponse>({
    mutationFn: authRepository.login,
    options: {
      onSuccess: (auth) => {
        setAuthenticated(auth.user, auth);
        void navigate({ to: search.redirectTo || '/', replace: true });
      },
      onError: (error) => {
        message.error(getFormattedErrorMessage(error));
      },
    },
  });
}
