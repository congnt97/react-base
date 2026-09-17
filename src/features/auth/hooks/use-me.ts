import { queryOptions } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api';

const authKeys = {
  me: ['auth', 'me'] as const,
};

// Used in the beforeLoad of routes/_app/route.tsx; the user then lives in the auth store.
export const meQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    retry: false,
  });
