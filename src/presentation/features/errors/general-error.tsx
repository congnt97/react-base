import { Button, Result } from 'antd';

export function GeneralError() {
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
