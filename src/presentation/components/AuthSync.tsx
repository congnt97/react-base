import { useEffect } from 'react';

import { useMe } from '@/presentation/hooks/auth/useMe';
import { useAuthStore } from '@/presentation/stores/useAuthStore';

export function AuthSync() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const meQuery = useMe({ enabled: isAuthenticated });

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    if (meQuery.data) {
      setAuthenticated(meQuery.data.data ?? meQuery.data.result ?? null);
    }

    if (meQuery.isError) {
      clearAuth();
    }
  }, [
    clearAuth,
    isAuthenticated,
    meQuery.data,
    meQuery.isError,
    setAuthenticated,
    setIsLoading,
  ]);

  return null;
}
