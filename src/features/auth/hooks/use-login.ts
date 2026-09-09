import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { App } from 'antd';

import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';
import { getErrorMessage } from '@/lib/api-error';

export function useLogin() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { redirectTo } = useSearch({ from: '/auth/login' });
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (auth) => {
      setAuthenticated(auth.user, auth);
      void navigate({ to: redirectTo || '/', replace: true });
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}
