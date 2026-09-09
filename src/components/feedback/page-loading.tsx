import { Spin } from 'antd';

export function PageLoading() {
  return (
    <div
      role="status"
      aria-label="Đang tải"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <Spin size="large" />
    </div>
  );
}
