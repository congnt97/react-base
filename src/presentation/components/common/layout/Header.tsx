import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown } from 'antd';

import { useLogout } from '@/presentation/hooks/auth/useLogout';
import { useAuthStore } from '@/presentation/stores/useAuthStore';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <header className="app-header">
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Đăng xuất',
              onClick: () => logout.mutate(),
            },
          ],
        }}
      >
        <Button type="text" className="h-10 px-2">
          <span className="flex items-center gap-2">
            <Avatar size={32} icon={<UserOutlined />} />
            <span className="hidden max-w-[180px] truncate text-sm font-medium sm:inline">
              {user?.name || user?.email || 'Tài khoản'}
            </span>
          </span>
        </Button>
      </Dropdown>
    </header>
  );
}
