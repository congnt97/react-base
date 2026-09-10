import {
  DashboardOutlined,
  FolderOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link, useRouterState } from '@tanstack/react-router';
import { Grid, Layout, Menu } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Drawer } from '@/components/ui/drawer';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import type { Permission } from '@/features/auth/permissions';

const { Sider } = Layout;

type NavItem = {
  key: '/' | '/projects' | '/members' | '/settings';
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
    key: '/members',
    label: 'Thành viên',
    icon: <TeamOutlined />,
    permission: 'members:read',
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

/** Dùng chung cho Sider (desktop) và Drawer (mobile). */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
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
    label: (
      <Link to={item.key} onClick={onNavigate}>
        {t(item.label)}
      </Link>
    ),
  }));

  return (
    <>
      <div className="flex h-16 items-center px-6">
        {/* text-white! vì AntD đặt màu link cho mọi <a>; nền sidebar tối cần chữ trắng. */}
        <Link
          to="/"
          onClick={onNavigate}
          className="text-base font-semibold text-white!"
        >
          React Base
        </Link>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[matchNavKey(pathname) ?? '']}
        items={items}
      />
    </>
  );
}

type SidebarProps = {
  /** Mobile: Drawer do Header điều khiển. Desktop: bỏ qua, dùng Sider cố định. */
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const isDesktop = Grid.useBreakpoint().lg;

  if (!isDesktop) {
    return (
      <Drawer
        open={open}
        placement="left"
        // AntD 6 deprecate `width` của Drawer; `size` nhận số px.
        size={260}
        closable={false}
        onClose={onClose}
        classNames={{ body: 'app-sidebar-drawer' }}
        aria-label={t('Điều hướng')}
      >
        <SidebarContent onNavigate={onClose} />
      </Drawer>
    );
  }

  return (
    <Sider width={260} className="overflow-auto">
      <SidebarContent />
    </Sider>
  );
}
