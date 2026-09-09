import { createRouter } from '@tanstack/react-router';

import { PageLoading } from '@/components/feedback/page-loading';
import { RouteError } from '@/components/feedback/route-error';
import { useAuthStore } from '@/features/auth/store';
import { subscribeSessionExpired } from '@/lib/auth-storage';
import { queryClient } from '@/lib/query-client';
import { routeTree } from '@/routeTree.gen';

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultStructuralSharing: true,
  scrollRestoration: true,
  // Hiện spinner thay vì trang trắng khi beforeLoad/loader chờ API (vd /me lúc mở app).
  defaultPendingComponent: PageLoading,
  defaultPendingMs: 200,
  defaultErrorComponent: RouteError,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// lib/http.ts gọi notifySessionExpired khi refresh token thất bại.
subscribeSessionExpired(() => {
  useAuthStore.getState().clearAuth();
  queryClient.clear();
  void router.navigate({
    to: '/auth/login',
    search: { redirectTo: undefined },
    replace: true,
  });
});
