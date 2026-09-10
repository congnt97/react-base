import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/feedback/empty-state';

type ProjectsEmptyStateProps = {
  /** Rỗng do lọc thì gợi ý đổi filter; rỗng thật thì gợi ý tạo mới. */
  hasFilter: boolean;
  /** undefined = không có quyền tạo, ẩn nút. */
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
