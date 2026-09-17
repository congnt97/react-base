import { createRouter } from '@tanstack/react-router';

import { PageLoading } from '@/components/feedback/page-loading';
import { RouteError } from '@/components/feedback/route-error';
import { useAuthStore } from '@/features/auth/store';
import { analytics } from '@/lib/analytics';
import { subscribeSessionExpired } from '@/lib/auth-storage';
import { queryClient } from '@/lib/query-client';
import { routeTree } from '@/routeTree.gen';
import { LoginReason } from '@/features/auth/search';

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultStructuralSharing: true,
  scrollRestoration: true,
  // Shows a spinner instead of a blank page while beforeLoad/loader waits on the API (e.g. /me on app start).
  defaultPendingComponent: PageLoading,
  defaultPendingMs: 200,
  defaultErrorComponent: RouteError,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// lib/http.ts calls notifySessionExpired when the refresh token fails.
// Keeps redirectTo so login returns to the right screen; reason tells login why.
subscribeSessionExpired(() => {
  useAuthStore.getState().clearAuth();
  queryClient.clear();
  const { href } = router.state.location;
  void router.navigate({
    to: '/auth/login',
    search: {
      redirectTo: href.startsWith('/auth') ? undefined : href,
      reason: LoginReason.EXPIRED,
    },
    replace: true,
  });
});

// Page view for analytics after every navigation completes.
router.subscribe('onResolved', ({ toLocation }) => {
  analytics.page(toLocation.pathname);
});
