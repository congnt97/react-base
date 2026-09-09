import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

import { getErrorMessage } from '@/lib/api-error';

type ErrorStateProps = {
  error: unknown;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Result
      status="error"
      title={t('Không tải được dữ liệu')}
      subTitle={t(getErrorMessage(error))}
      extra={
        onRetry ? (
          <Button type="primary" onClick={onRetry}>
            {t('Thử lại')}
          </Button>
        ) : null
      }
    />
  );
}
