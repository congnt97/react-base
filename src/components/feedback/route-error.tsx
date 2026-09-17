import { Link, type ErrorComponentProps } from '@tanstack/react-router';
import { Button, Result } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorMessage } from '@/lib/api-error';
import { monitoring } from '@/lib/monitoring';

// Used as the router's defaultErrorComponent: detects a 403 error to show the right page.
export function RouteError({ error }: ErrorComponentProps) {
  const { t } = useTranslation();
  const isForbidden = error instanceof Error && error.name === 'ForbiddenError';

  // Reports render/loader errors to monitoring (a system outside React), skipping 403.
  useEffect(() => {
    if (!isForbidden) {
      monitoring.captureException(error, { source: 'route' });
    }
  }, [error, isForbidden]);

  if (isForbidden) {
    return (
      <Result
        status="403"
        title={t('Không có quyền truy cập')}
        subTitle={t(getErrorMessage(error))}
        extra={
          <Link to="/">
            <Button type="primary">{t('Về dashboard')}</Button>
          </Link>
        }
      />
    );
  }

  return (
    <Result
      status="error"
      title={t('Đã có lỗi xảy ra')}
      subTitle={t('Vui lòng tải lại trang hoặc thử lại sau.')}
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          {t('Tải lại')}
        </Button>
      }
    />
  );
}
