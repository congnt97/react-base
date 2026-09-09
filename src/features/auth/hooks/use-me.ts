import { queryOptions } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api';

const authKeys = {
  me: ['auth', 'me'] as const,
};

// Dùng trong beforeLoad của routes/_app/route.tsx; user sau đó nằm trong auth store.
export const meQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    retry: false,
  });
