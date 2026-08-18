/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { App as AntdApp, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

import { routeTree } from './routeTree.gen';
import { Provider as QueryProvider } from './presentation/provider/integrations/tanstack-query/root-provider';
import { getContext as getQueryContext } from './presentation/provider/integrations/tanstack-query/query-client';
import { antdTheme } from './presentation/provider/theme/antd-theme';
import {
  RepositoriesProvider,
  createRepositoryContainer,
} from './di/RepositoriesProvider';
import { useAuthStore } from './presentation/stores/useAuthStore';
import { subscribeSessionExpired } from './shared/auth-storage';
import './styles/styles.css';

const queryContext = getQueryContext();
const repositories = createRepositoryContainer();

const router = createRouter({
  routeTree,
  context: {
    ...queryContext,
    // Router yêu cầu context đủ shape lúc khởi tạo; giá trị auth thật được
    // truyền vào ngay dưới qua RouterProvider trước khi bất kỳ route nào render.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!,
    repositories,
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

subscribeSessionExpired(() => {
  useAuthStore.getState().clearAuth();
  void router.navigate({
    to: '/auth/login',
    search: { redirectTo: undefined },
    replace: true,
  });
});

function InnerApp() {
  const auth = useAuthStore();

  return (
    <RouterProvider
      router={router}
      context={{
        ...queryContext,
        auth,
        repositories,
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
          <RepositoriesProvider container={repositories}>
            <QueryProvider queryClient={queryContext.queryClient}>
              <InnerApp />
            </QueryProvider>
          </RepositoriesProvider>
        </AntdApp>
      </ConfigProvider>
    </StrictMode>,
  );
}
