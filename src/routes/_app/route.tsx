import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { AppShell } from '@/presentation/layouts/app-shell';
import { getMeQueryOptions } from '@/presentation/hooks/auth/useMe';
import { useAuthStore } from '@/presentation/stores/useAuthStore';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
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
      const user = await context.queryClient.ensureQueryData(
        getMeQueryOptions(context.repositories.authRepository),
      );
      context.auth.setAuthenticated(user);
    } catch {
      context.auth.clearAuth();
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
