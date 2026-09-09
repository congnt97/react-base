import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { AppShell } from '@/presentation/layouts/app-shell';
import { getMeQueryOptions } from '@/presentation/hooks/auth/useMe';
import { useAuthStore } from '@/presentation/stores/useAuthStore';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    // Đọc store trực tiếp (không qua router context) để guard luôn thấy giá trị
    // mới nhất ngay sau login/logout, không phụ thuộc React re-render.
    const auth = useAuthStore.getState();

    if (!auth.isAuthenticated) {
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
      auth.setAuthenticated(user);
    } catch {
      auth.clearAuth();
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
