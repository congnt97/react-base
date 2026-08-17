import { Button, Result } from 'antd';
import { Link } from '@tanstack/react-router';

export function NotFoundError() {
  return (
    <Result
      status="404"
      title="Không tìm thấy trang"
      subTitle="Đường dẫn bạn truy cập không tồn tại."
      extra={
        <Link to="/">
          <Button type="primary">Về dashboard</Button>
        </Link>
      }
    />
  );
}
