import { DashboardOutlined } from '@ant-design/icons';
import { Link, useRouterState } from '@tanstack/react-router';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

export function Sidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <Sider className="app-sidebar" width={260}>
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="text-base font-semibold text-white">
          React Base
        </Link>
      </div>

      <Menu
        className="app-sidebar-menu"
        mode="inline"
        selectedKeys={[pathname]}
        items={[
          {
            key: '/',
            icon: <DashboardOutlined />,
            label: <Link to="/">Dashboard</Link>,
          },
        ]}
      />
    </Sider>
  );
}
