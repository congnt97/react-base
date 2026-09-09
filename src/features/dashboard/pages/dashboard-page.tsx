import {
  ApiOutlined,
  FolderOutlined,
  LayoutOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { Card, Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/layout/page-header';

const items = [
  {
    title: 'Feature-first',
    description: 'Mỗi feature tự chứa api, hooks, components, pages.',
    icon: <FolderOutlined />,
    className: 'stat-icon-blue',
  },
  {
    title: 'API flow',
    description:
      'lib/http -> features/<x>/api -> hooks (TanStack Query) -> page.',
    icon: <ApiOutlined />,
    className: 'stat-icon-green',
  },
  {
    title: 'Auth guard',
    description:
      'Token ở auth-storage, guard đọc store, permission theo hành động.',
    icon: <SafetyCertificateOutlined />,
    className: 'stat-icon-amber',
  },
  {
    title: 'CRUD mẫu',
    description: 'Xem trang Dự án: filter qua URL, phân trang, form modal.',
    icon: <LayoutOutlined />,
    className: 'stat-icon-slate',
    to: '/projects',
  },
];

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('Dashboard')}
        description={t(
          'Base core sẵn sàng để phát triển module frontend React.',
        )}
      />

      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col key={item.title} xs={24} md={12} xl={6}>
            <Card className="app-card h-full">
              <div className="flex items-start gap-3">
                <span className={`stat-icon ${item.className}`}>
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <Typography.Title level={5} className="!m-0">
                    {item.to ? (
                      <Link to={item.to}>{t(item.title)}</Link>
                    ) : (
                      t(item.title)
                    )}
                  </Typography.Title>
                  <Typography.Paragraph className="!mb-0 !mt-1 !text-sm !text-[var(--text-muted)]">
                    {t(item.description)}
                  </Typography.Paragraph>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
