import { Link, type ErrorComponentProps } from '@tanstack/react-router';
import { Button, Result } from 'antd';

// Dùng làm defaultErrorComponent của router: nhận diện lỗi 403 để hiện đúng trang.
export function RouteError({ error }: ErrorComponentProps) {
  if (error.name === 'ForbiddenError') {
    return (
      <Result
        status="403"
        title="Không có quyền truy cập"
        subTitle={error.message}
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
