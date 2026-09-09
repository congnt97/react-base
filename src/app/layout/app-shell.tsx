import { Layout } from 'antd';
import type { ReactNode } from 'react';

import { Header } from '@/app/layout/header';
import { Sidebar } from '@/app/layout/sidebar';

const { Content } = Layout;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Layout className="h-screen overflow-hidden">
      <Sidebar />

      <Layout className="flex flex-1 flex-col overflow-hidden">
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
