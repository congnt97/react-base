import { Card, Descriptions } from 'antd';

import { PageHeader } from '@/components/layout/page-header';
import { useAuthStore } from '@/features/auth/store';

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <PageHeader
        title="Cài đặt"
        description="Ví dụ route cần permission settings:manage (requirePermission trong beforeLoad)."
      />

      <Card className="app-card">
        <Descriptions
          column={1}
          items={[
            {
              key: 'email',
              label: 'Email',
              children: user?.email ?? 'Chưa có email',
            },
            {
              key: 'name',
              label: 'Tên',
              children: user?.name ?? 'Chưa cập nhật',
            },
            {
              key: 'role',
              label: 'Vai trò',
              children: user?.role ?? 'Chưa xác định',
            },
          ]}
        />
      </Card>
    </>
  );
}
