import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { useAuthStore } from '@/presentation/stores/useAuthStore';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/',
        replace: true,
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
