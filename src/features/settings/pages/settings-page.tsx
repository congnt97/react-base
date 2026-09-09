import { Card, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/layout/page-header';
import { useAuthStore } from '@/features/auth/store';

export function SettingsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <PageHeader
        title={t('Cài đặt')}
        description={t(
          'Ví dụ route cần permission settings:manage (requirePermission trong beforeLoad).',
        )}
      />

      <Card className="app-card">
        <Descriptions
          column={1}
          items={[
            {
              key: 'email',
              label: t('Email'),
              children: user?.email ?? t('Chưa có email'),
            },
            {
              key: 'name',
              label: t('Tên'),
              children: user?.name ?? t('Chưa cập nhật'),
            },
            {
              key: 'role',
              label: t('Vai trò'),
              children: user?.role ?? t('Chưa xác định'),
            },
          ]}
        />
      </Card>
    </>
  );
}
