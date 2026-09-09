import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { AppShell } from '@/app/layout/app-shell';
import { meQueryOptions } from '@/features/auth/hooks/use-me';
import { useAuthStore } from '@/features/auth/store';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    // Đọc store trực tiếp để guard thấy giá trị mới nhất ngay sau login/logout,
    // không phụ thuộc React re-render.
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

function RouteComponent() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
