import { LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Dropdown, Grid, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { changeLocale } from '@/app/i18n';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { useAuthStore } from '@/features/auth/store';
import { Locale } from '@/lib/locale-storage';

const LOCALE_LABELS: Record<Locale, string> = {
  [Locale.VI]: 'Tiếng Việt',
  [Locale.EN]: 'Tiếng Anh',
};

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { t, i18n } = useTranslation();
  const { modal } = App.useApp();
  const isDesktop = Grid.useBreakpoint().lg;
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const confirmLogout = () => {
    modal.confirm({
      title: t('Đăng xuất khỏi hệ thống?'),
      content: t('Bạn sẽ cần đăng nhập lại để tiếp tục.'),
      okText: t('Đăng xuất'),
      okButtonProps: { danger: true },
      cancelText: t('Huỷ'),
      // Server logout errors are already handled by useLogout in onSettled; the modal just closes.
      onOk: () =>
        logout.mutateAsync().then(
          () => undefined,
          () => undefined,
        ),
    });
  };

  return (
    <header className="app-header">
      {/* Below lg, the Sider collapses to 0, so this is the only nav entry point. */}
      {isDesktop ? null : (
        <Button
          type="text"
          icon={<MenuOutlined />}
          aria-label={t('Mở menu')}
          onClick={onOpenMenu}
          className="mr-auto"
        />
      )}

      <Select<Locale>
        size="small"
        variant="borderless"
        aria-label={t('Ngôn ngữ')}
        value={i18n.language as Locale}
        options={Object.values(Locale).map((value) => ({
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
