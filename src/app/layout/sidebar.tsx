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
import { Permission } from '@/features/auth/permissions';

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
    permission: Permission.PROJECTS_READ,
  },
  {
    key: '/members',
    label: 'Thành viên',
    icon: <TeamOutlined />,
    permission: Permission.MEMBERS_READ,
  },
  {
    key: '/settings',
    label: 'Cài đặt',
    icon: <SettingOutlined />,
    permission: Permission.SETTINGS_MANAGE,
  },
];

const matchNavKey = (pathname: string) =>
  NAV_ITEMS.map((item) => item.key)
    .filter((key) =>
      key === '/' ? pathname === '/' : pathname.startsWith(key),
    )
    .sort((a, b) => b.length - a.length)[0];

/** Shared by the Sider (desktop) and Drawer (mobile). */
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
        {/* text-white! because AntD sets a link color on every <a>; the dark sidebar needs white text. */}
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
  /** Mobile: Drawer controlled by Header. Desktop: ignored, uses a fixed Sider. */
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
        // AntD 6 deprecates Drawer's `width`; `size` takes a pixel number.
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
