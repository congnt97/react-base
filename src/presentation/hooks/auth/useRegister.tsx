import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';

import { getFormattedErrorMessage } from '@/application/dto/response/ErrorResponse';
import type { RegisterRequest, RegisterResponse } from '@/domain/models/Auth';
import { useRepository } from '@/di/RepositoriesProvider';
import { useApiMutation } from '@/infrastructure/hooks/useApi';

export function useRegister() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { authRepository } = useRepository();

  return useApiMutation<RegisterRequest, RegisterResponse>({
    mutationFn: authRepository.register,
    options: {
      onSuccess: () => {
        message.success('Đăng ký thành công');
        void navigate({ to: '/auth/login', search: { redirectTo: undefined } });
      },
      onError: (error) => {
        message.error(getFormattedErrorMessage(error));
      },
    },
  });
}
