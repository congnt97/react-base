import { Layout } from 'antd';
import type { ReactNode } from 'react';

import { Header } from '@/presentation/components/common/layout/Header';
import { Sidebar } from '@/presentation/components/common/layout/Sidebar';

const { Content } = Layout;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Layout className="h-screen overflow-hidden bg-[var(--app-bg)]">
      <Sidebar />

      <Layout className="flex flex-1 flex-col overflow-hidden bg-[var(--app-bg)]">
        <Header />

        <Content className="flex-1 overflow-y-auto p-6">
          <main className="mx-auto flex max-w-[1440px] flex-col gap-6">
            {children}
          </main>
        </Content>
      </Layout>
    </Layout>
  );
}
