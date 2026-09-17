import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  PROJECT_STATUS_LABELS,
  ProjectStatus,
} from '@/features/projects/types';

const STATUS_COLORS: Record<ProjectStatus, string> = {
  active: 'success',
  paused: 'warning',
  archived: 'default',
};

type ProjectStatusTagProps = {
  status: ProjectStatus;
  /** With onChange, the tag becomes a dropdown to change status (needs update permission). */
  onChange?: (status: ProjectStatus) => void;
};

export function ProjectStatusTag({ status, onChange }: ProjectStatusTagProps) {
  const { t } = useTranslation();
  const tag = (
    <Tag
      color={STATUS_COLORS[status]}
      className={onChange ? 'cursor-pointer' : ''}
    >
      {t(PROJECT_STATUS_LABELS[status])}
      {onChange ? <DownOutlined className="ml-1 text-[10px]" /> : null}
    </Tag>
  );

  if (!onChange) {
    return tag;
  }

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        selectedKeys: [status],
        items: Object.values(ProjectStatus).map((value) => ({
          key: value,
          label: t(PROJECT_STATUS_LABELS[value]),
          disabled: value === status,
        })),
        onClick: ({ key }) => onChange(key as ProjectStatus),
      }}
    >
      <button
        type="button"
        className="cursor-pointer border-0 bg-transparent p-0"
        aria-label={t('Đổi trạng thái')}
      >
        {tag}
      </button>
    </Dropdown>
  );
}
