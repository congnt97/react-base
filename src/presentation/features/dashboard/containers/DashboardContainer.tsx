import {
  ApiOutlined,
  BranchesOutlined,
  LayoutOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';

import { PageHeader } from '@/presentation/components/common/layout/PageHeader';

const coreItems = [
  {
    title: 'Architecture',
    description: 'domain, application, infrastructure, presentation, routes',
    icon: <BranchesOutlined />,
    className: 'stat-icon-blue',
  },
  {
    title: 'API flow',
    description: 'repository interface, implementation, hooks, TanStack Query',
    icon: <ApiOutlined />,
    className: 'stat-icon-green',
  },
  {
    title: 'Auth guard',
    description: 'lưu token, Zustand UI state, protected _app routes',
    icon: <SafetyCertificateOutlined />,
    className: 'stat-icon-amber',
  },
  {
    title: 'CMS UI',
    description: 'Ant Design, Tailwind utilities, Inter, token app shell',
    icon: <LayoutOutlined />,
    className: 'stat-icon-slate',
  },
];

export function DashboardContainer() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Base core sẵn sàng để phát triển module frontend React."
      />

      <Row gutter={[16, 16]}>
        {coreItems.map((item) => (
          <Col key={item.title} xs={24} md={12} xl={6}>
            <Card className="app-card h-full">
              <div className="flex items-start gap-3">
                <span className={`stat-icon ${item.className}`}>
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <Typography.Title level={5} className="!m-0">
                    {item.title}
                  </Typography.Title>
                  <Typography.Paragraph className="!mb-0 !mt-1 !text-sm !text-[var(--text-muted)]">
                    {item.description}
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
