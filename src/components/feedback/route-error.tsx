import { Link, type ErrorComponentProps } from '@tanstack/react-router';
import { Button, Result } from 'antd';
import { useEffect } from 'react';

import { getErrorMessage } from '@/lib/api-error';
import { monitoring } from '@/lib/monitoring';

// Dùng làm defaultErrorComponent của router: nhận diện lỗi 403 để hiện đúng trang.
export function RouteError({ error }: ErrorComponentProps) {
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
        title="Không có quyền truy cập"
        subTitle={getErrorMessage(error)}
        extra={
          <Link to="/">
            <Button type="primary">Về dashboard</Button>
          </Link>
        }
      />
    );
  }

  return (
    <Result
      status="error"
      title="Đã có lỗi xảy ra"
      subTitle="Vui lòng tải lại trang hoặc thử lại sau."
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          Tải lại
        </Button>
      }
    />
  );
}
