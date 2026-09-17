import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: authApi.logout,
    // Even if the server logout call fails, clear local state and go back to login.
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      void navigate({
        to: '/auth/login',
        search: { redirectTo: undefined, reason: undefined },
        replace: true,
      });
    },
  });
}
