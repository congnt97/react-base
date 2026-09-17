import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { monitoring } from '@/lib/monitoring';

// Server/network errors from every query/mutation all flow through monitoring in one place;
// toasting the user is still handled by each feature's own hook.
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
