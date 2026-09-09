import { Link, type ErrorComponentProps } from '@tanstack/react-router';
import { Button, Result } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorMessage } from '@/lib/api-error';
import { monitoring } from '@/lib/monitoring';

// Dùng làm defaultErrorComponent của router: nhận diện lỗi 403 để hiện đúng trang.
export function RouteError({ error }: ErrorComponentProps) {
  const { t } = useTranslation();
  const isForbidden = error instanceof Error && error.name === 'ForbiddenError';

  // Báo lỗi render/loader về monitoring (hệ thống ngoài React), bỏ qua 403.
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
