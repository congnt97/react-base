import { Tag } from 'antd';

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
  return (
    <Tag color={STATUS_COLORS[status]}>{PROJECT_STATUS_LABELS[status]}</Tag>
  );
}
