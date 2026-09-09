import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { antdTheme } from '@/app/theme';
import { queryClient } from '@/lib/query-client';

const ANTD_LOCALES = { vi: viVN, en: enUS };

export function AppProviders({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const antdLocale =
    ANTD_LOCALES[i18n.language as keyof typeof ANTD_LOCALES] ?? viVN;

  return (
    <ConfigProvider locale={antdLocale} theme={antdTheme}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
