import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

import { GeneralError } from '@/presentation/features/errors/general-error';
import { NotFoundError } from '@/presentation/features/errors/not-found-error';
import type { AuthState } from '@/presentation/stores/useAuthStore';

interface RouterContext {
  queryClient: QueryClient;
  auth: AuthState;
}

const AppDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@/presentation/provider/devtools/AppDevtools').then((module) => ({
        default: module.AppDevtools,
      })),
    )
  : null;

export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: GeneralError,
  notFoundComponent: NotFoundError,
  component: () => (
    <>
      <Outlet />
      {AppDevtools ? (
        <Suspense fallback={null}>
          <AppDevtools />
        </Suspense>
      ) : null}
    </>
  ),
});
