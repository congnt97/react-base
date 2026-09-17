import { Card, Descriptions, Space, Tag } from 'antd';
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
              // Permissions are already normalized at the API boundary; shown here to check the backend returns them correctly.
              key: 'permissions',
              label: t('Quyền'),
              children: user?.permissions.length ? (
                <Space size={[0, 4]} wrap>
                  {user.permissions.map((permission) => (
                    <Tag key={permission}>{permission}</Tag>
                  ))}
                </Space>
              ) : (
                t('Không có quyền nào')
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
