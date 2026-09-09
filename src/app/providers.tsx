import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import type { ReactNode } from 'react';

import { antdTheme } from '@/app/theme';
import { queryClient } from '@/lib/query-client';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={viVN} theme={antdTheme}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
