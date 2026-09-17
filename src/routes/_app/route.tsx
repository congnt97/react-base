import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { AppShell } from '@/app/layout/app-shell';
import { meQueryOptions } from '@/features/auth/hooks/use-me';
import { useAuthStore } from '@/features/auth/store';

export const Route = createFileRoute('/_app')({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
  beforeLoad: async ({ context, location }) => {
    // Reads the store directly so the guard sees the latest value right after login/logout,
    // without depending on a React re-render.
    const auth = useAuthStore.getState();
    const redirectToLogin = () =>
      redirect({
        to: '/auth/login',
        search: { redirectTo: location.href },
        replace: true,
      });

    if (!auth.isAuthenticated) {
      throw redirectToLogin();
    }

    try {
      const user = await context.queryClient.ensureQueryData(meQueryOptions());
      auth.setAuthenticated(user);
    } catch {
      auth.clearAuth();
      throw redirectToLogin();
    }
  },
});
