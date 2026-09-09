import {
  DashboardOutlined,
  FolderOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useRouterState } from '@tanstack/react-router';
import { Layout, Menu } from 'antd';

import { hasRole } from '@/features/auth/guards';
import { useAuthStore } from '@/features/auth/store';
import { Role } from '@/features/auth/types';

const { Sider } = Layout;

const NAV_ITEMS = [
  { key: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/projects', label: 'Dự án', icon: <FolderOutlined /> },
  {
    key: '/settings',
    label: 'Cài đặt',
    icon: <SettingOutlined />,
    roles: [Role.ADMIN],
  },
] as const;

const matchNavKey = (pathname: string) =>
  NAV_ITEMS.map((item) => item.key)
    .filter((key) =>
      key === '/' ? pathname === '/' : pathname.startsWith(key),
    )
    .sort((a, b) => b.length - a.length)[0];

export function Sidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const user = useAuthStore((state) => state.user);

  const items = NAV_ITEMS.filter(
    (item) => !('roles' in item) || hasRole(user, ...item.roles),
  ).map((item) => ({
    key: item.key,
    icon: item.icon,
    label: <Link to={item.key}>{item.label}</Link>,
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
