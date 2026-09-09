import { Link } from '@tanstack/react-router';
import { Button, Result } from 'antd';

export function NotFound() {
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
