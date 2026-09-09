import { Button, Result } from 'antd';

import { getErrorMessage } from '@/lib/api-error';

type ErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Result
      status="error"
      title="Không tải được dữ liệu"
      subTitle={getErrorMessage(error)}
      extra={
        onRetry ? (
          <Button type="primary" onClick={onRetry}>
            Thử lại
          </Button>
        ) : null
      }
    />
  );
}
