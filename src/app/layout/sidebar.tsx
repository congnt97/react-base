import {
  DashboardOutlined,
  FolderOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useRouterState } from '@tanstack/react-router';
import { Layout, Menu } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { usePermissions } from '@/features/auth/hooks/use-permissions';
import type { Permission } from '@/features/auth/permissions';

const { Sider } = Layout;

type NavItem = {
  key: '/' | '/projects' | '/settings';
  label: string;
  icon: ReactNode;
  permission?: Permission;
};

const NAV_ITEMS: NavItem[] = [
  { key: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  {
    key: '/projects',
    label: 'Dự án',
    icon: <FolderOutlined />,
    permission: 'projects:read',
  },
  {
    key: '/settings',
    label: 'Cài đặt',
    icon: <SettingOutlined />,
    permission: 'settings:manage',
  },
];

const matchNavKey = (pathname: string) =>
  NAV_ITEMS.map((item) => item.key)
    .filter((key) =>
      key === '/' ? pathname === '/' : pathname.startsWith(key),
    )
    .sort((a, b) => b.length - a.length)[0];

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { can } = usePermissions();

  const items = NAV_ITEMS.filter(
    (item) => !item.permission || can(item.permission),
  ).map((item) => ({
    key: item.key,
    icon: item.icon,
    label: <Link to={item.key}>{t(item.label)}</Link>,
  }));

  return (
    // Dưới breakpoint lg thì thu gọn hẳn để nội dung không bị ép.
    <Sider
      width={260}
      breakpoint="lg"
      collapsedWidth={0}
      className="overflow-auto"
    >
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="text-base font-semibold text-white">
          React Base
        </Link>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[matchNavKey(pathname) ?? '']}
        items={items}
      />
    </Sider>
  );
}
