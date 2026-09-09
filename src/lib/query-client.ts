import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { monitoring } from '@/lib/monitoring';

// Lỗi server/mạng từ mọi query/mutation đều đi qua monitoring một chỗ;
// toast cho user vẫn do hook của từng feature xử lý.
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      monitoring.captureException(error, { queryKey: query.queryKey });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      monitoring.captureException(error, {
        mutationKey: mutation.options.mutationKey,
      });
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
