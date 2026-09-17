import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/feedback/empty-state';

type ProjectsEmptyStateProps = {
  /** Empty because of a filter suggests changing it; genuinely empty suggests creating one. */
  hasFilter: boolean;
  /** undefined = no create permission, hides the button. */
  onCreate?: () => void;
};

export function ProjectsEmptyState({
  hasFilter,
  onCreate,
}: ProjectsEmptyStateProps) {
  const { t } = useTranslation();

  if (hasFilter) {
    return (
      <EmptyState
        title={t('Không có dự án khớp bộ lọc')}
        description={t('Thử đổi từ khoá hoặc trạng thái.')}
      />
    );
  }

  return (
    <EmptyState
      title={t('Chưa có dự án nào')}
      description={t('Tạo dự án đầu tiên để bắt đầu.')}
      action={
        onCreate
          ? { label: t('Tạo dự án'), icon: <PlusOutlined />, onClick: onCreate }
          : undefined
      }
    />
  );
}
