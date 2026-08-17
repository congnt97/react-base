/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { App as AntdApp, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Toaster } from 'sonner';

import { routeTree } from './routeTree.gen';
import { Provider as QueryProvider } from './presentation/provider/integrations/tanstack-query/root-provider';
import { getContext as getQueryContext } from './presentation/provider/integrations/tanstack-query/query-client';
import { antdTheme } from './presentation/provider/theme/antd-theme';
import { RepositoriesProvider } from './di/RepositoriesProvider';
import { useAuthStore } from './presentation/stores/useAuthStore';
import { AuthSync } from './presentation/components/AuthSync';
import './styles/styles.css';

const queryContext = getQueryContext();

const router = createRouter({
  routeTree,
  context: {
    ...queryContext,
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuthStore();

  return (
    <RouterProvider
      router={router}
      context={{
        ...queryContext,
        auth,
      }}
    />
  );
}

const rootElement = document.getElementById('app');

if (rootElement && !rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <ConfigProvider locale={viVN} theme={antdTheme}>
        <AntdApp>
          <RepositoriesProvider>
            <QueryProvider queryClient={queryContext.queryClient}>
              <AuthSync />
              <InnerApp />
              <Toaster position="top-right" richColors />
            </QueryProvider>
          </RepositoriesProvider>
        </AntdApp>
      </ConfigProvider>
    </StrictMode>,
  );
}
