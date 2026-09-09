import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
} from '@/features/projects/types';

const STATUS_COLORS: Record<ProjectStatus, string> = {
  active: 'success',
  paused: 'warning',
  archived: 'default',
};

export function ProjectStatusTag({ status }: { status: ProjectStatus }) {
  const { t } = useTranslation();

  return (
    <Tag color={STATUS_COLORS[status]}>{t(PROJECT_STATUS_LABELS[status])}</Tag>
  );
}
