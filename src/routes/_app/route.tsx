import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import { AppShell } from '@/presentation/layouts/app-shell';
import { getMeQueryOptions } from '@/presentation/hooks/auth/useMe';
import {
  useAuthStore,
  type AuthState,
} from '@/presentation/stores/useAuthStore';

type AppRouteContext = {
  queryClient: QueryClient;
  auth: AuthState;
};

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    const appContext = context as AppRouteContext;

    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirectTo: location.href,
        },
        replace: true,
      });
    }

    try {
      const data =
        await appContext.queryClient.ensureQueryData(getMeQueryOptions());
      const user = data.data ?? data.result;
      if (user) {
        appContext.auth.setAuthenticated(user);
      }
    } catch {
      appContext.auth.clearAuth();
      throw redirect({
        to: '/auth/login',
        search: {
          redirectTo: location.href,
        },
        replace: true,
      });
    }
  },
});

function RouteComponent() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
