import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { AppProviders } from '@/app/providers';
import { router } from '@/app/router';
import { env } from '@/lib/env';
import '@/styles/styles.css';

// MSW chỉ chạy ở dev khi bật VITE_ENABLE_MOCK_API; production không bundle mocks.
async function enableMocking() {
  if (!import.meta.env.DEV || !env.VITE_ENABLE_MOCK_API) {
    return;
  }

  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

const rootElement = document.getElementById('app');

if (rootElement && !rootElement.innerHTML) {
  void enableMocking().then(() => {
    ReactDOM.createRoot(rootElement).render(
      <StrictMode>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </StrictMode>,
    );
  });
}
