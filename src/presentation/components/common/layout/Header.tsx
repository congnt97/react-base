import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Dropdown } from 'antd';

import { useLogout } from '@/presentation/hooks/auth/useLogout';
import { useAuthStore } from '@/presentation/stores/useAuthStore';

export function Header() {
  const { modal } = App.useApp();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const confirmLogout = () => {
    modal.confirm({
      title: 'Đăng xuất khỏi hệ thống?',
      content: 'Bạn sẽ cần đăng nhập lại để tiếp tục.',
      okText: 'Đăng xuất',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      // Lỗi logout phía server đã được useLogout xử lý trong onSettled
      // (vẫn clear local state và về trang login), modal chỉ cần đóng.
      onOk: () =>
        logout.mutateAsync().then(
          () => undefined,
          () => undefined,
        ),
    });
  };

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
              onClick: confirmLogout,
            },
          ],
        }}
      >
        <Button type="text" className="h-10 px-2" aria-label="Tài khoản">
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
