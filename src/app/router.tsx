import { createRouter } from '@tanstack/react-router';

import { PageLoading } from '@/components/feedback/page-loading';
import { RouteError } from '@/components/feedback/route-error';
import { useAuthStore } from '@/features/auth/store';
import { analytics } from '@/lib/analytics';
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
// Giữ redirectTo để đăng nhập lại xong quay về đúng màn; reason để login báo lý do.
subscribeSessionExpired(() => {
  useAuthStore.getState().clearAuth();
  queryClient.clear();
  const { href } = router.state.location;
  void router.navigate({
    to: '/auth/login',
    search: {
      redirectTo: href.startsWith('/auth') ? undefined : href,
      reason: 'expired',
    },
    replace: true,
  });
});

// Page view cho analytics sau mỗi lần điều hướng xong.
router.subscribe('onResolved', ({ toLocation }) => {
  analytics.page(toLocation.pathname);
});
