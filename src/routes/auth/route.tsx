import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { useAuthStore } from '@/features/auth/store';

export const Route = createFileRoute('/auth')({
  component: Outlet,
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/', replace: true });
    }
  },
});
