import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

import { NotFound } from '@/components/feedback/not-found';

interface RouterContext {
  queryClient: QueryClient;
}

const AppDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@/app/devtools').then((module) => ({
        default: module.AppDevtools,
      })),
    )
  : null;

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFound,
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
