import { getRouteApi } from '@tanstack/react-router';
import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';

import { AuthLayout } from '@/features/auth/components/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';

const route = getRouteApi('/auth/login');

export function LoginPage() {
  const { t } = useTranslation();
  const { reason } = route.useSearch();

  return (
    <AuthLayout>
      {reason === 'expired' ? (
        <Alert
          type="warning"
          showIcon
          className="mb-4"
          message={t('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.')}
        />
      ) : null}
      <LoginForm />
    </AuthLayout>
  );
}
