import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';

import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';
import { getErrorMessage } from '@/lib/api-error';

export function useLogin() {
  const { t } = useTranslation();
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
      // The server message is in Vietnamese; t() translates it if a key exists, otherwise it's kept as-is.
      message.error(t(getErrorMessage(error)));
    },
  });
}
