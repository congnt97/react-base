import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';

export function PageLoading() {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-label={t('Đang tải')}
      className="flex min-h-[60vh] items-center justify-center"
    >
      <Spin size="large" />
    </div>
  );
}
