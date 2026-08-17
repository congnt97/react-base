import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import type { AuthState } from '@/presentation/stores/useAuthStore';

type AuthRouteContext = {
  auth: AuthState;
};

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const authContext = context as AuthRouteContext;

    if (authContext.auth.isAuthenticated) {
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
