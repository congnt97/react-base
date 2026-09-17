import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { ANTD_LOCALES, DEFAULT_ANTD_LOCALE } from '@/app/language-packs';
import { antdTheme } from '@/app/theme';
import { queryClient } from '@/lib/query-client';

export function AppProviders({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const antdLocale = ANTD_LOCALES[i18n.language] ?? DEFAULT_ANTD_LOCALE;

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
