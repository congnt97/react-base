import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';

import { authApi } from '@/features/auth/api';
import { getErrorMessage } from '@/lib/api-error';

export function useRegister() {
  const { message } = App.useApp();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      message.success('Đăng ký thành công');
      void navigate({ to: '/auth/login', search: { redirectTo: undefined } });
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });
}
