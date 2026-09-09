import { Layout } from 'antd';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Header } from '@/app/layout/header';
import { Sidebar } from '@/app/layout/sidebar';

const { Content } = Layout;

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Layout className="h-screen overflow-hidden">
      {/* Bỏ qua điều hướng bằng bàn phím: chỉ hiện khi focus. */}
      <a href="#main-content" className="skip-link">
        {t('Tới nội dung chính')}
      </a>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Layout className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenMenu={() => setMenuOpen(true)} />

        <Content className="flex-1 overflow-y-auto p-6">
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto flex max-w-[1440px] flex-col gap-6"
          >
            {children}
          </main>
        </Content>
      </Layout>
    </Layout>
  );
}
