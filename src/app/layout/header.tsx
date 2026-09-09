import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Dropdown, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { changeLocale } from '@/app/i18n';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { useAuthStore } from '@/features/auth/store';
import { LOCALES, type Locale } from '@/lib/locale-storage';

const LOCALE_LABELS: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'Tiếng Anh',
};

export function Header() {
  const { t, i18n } = useTranslation();
  const { modal } = App.useApp();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const confirmLogout = () => {
    modal.confirm({
      title: t('Đăng xuất khỏi hệ thống?'),
      content: t('Bạn sẽ cần đăng nhập lại để tiếp tục.'),
      okText: t('Đăng xuất'),
      okButtonProps: { danger: true },
      cancelText: t('Huỷ'),
      // Lỗi logout server đã được useLogout xử lý trong onSettled; modal chỉ cần đóng.
      onOk: () =>
        logout.mutateAsync().then(
          () => undefined,
          () => undefined,
        ),
    });
  };

  return (
    <header className="app-header">
      <Select<Locale>
        size="small"
        variant="borderless"
        aria-label={t('Ngôn ngữ')}
        value={i18n.language as Locale}
        options={LOCALES.map((value) => ({
          value,
          label: t(LOCALE_LABELS[value]),
        }))}
        onChange={(locale) => void changeLocale(locale)}
      />

      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: t('Đăng xuất'),
              onClick: confirmLogout,
            },
          ],
        }}
      >
        <Button type="text" className="h-10 px-2" aria-label={t('Tài khoản')}>
          <span className="flex items-center gap-2">
            <Avatar size={32} icon={<UserOutlined />} />
            <span className="hidden max-w-[180px] truncate text-sm font-medium sm:inline">
              {user?.name || user?.email || t('Tài khoản')}
            </span>
          </span>
        </Button>
      </Dropdown>
    </header>
  );
}
