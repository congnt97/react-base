import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { SearchInput } from '@/components/ui/search-input';
import type { ProjectsSearch } from '@/features/projects/search';
import {
  ProjectStatus,
  PROJECT_STATUS_LABELS,
} from '@/features/projects/types';

type ProjectsFilterProps = {
  keyword?: string;
  status?: ProjectsSearch['status'];
  onChange: (filter: Pick<ProjectsSearch, 'keyword' | 'status'>) => void;
};

export function ProjectsFilter({
  keyword,
  status,
  onChange,
}: ProjectsFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SearchInput
        // Keyed by keyword so the input resets correctly when the URL changes externally (back/forward).
        key={keyword ?? ''}
        className="sm:max-w-[320px]"
        defaultValue={keyword}
        placeholder={t('Tìm theo tên dự án')}
        aria-label={t('Tìm theo tên dự án')}
        onSearch={(value) => onChange({ keyword: value, status })}
      />
      <Select
        allowClear
        className="sm:w-[180px]"
        placeholder={t('Trạng thái')}
        aria-label={t('Trạng thái')}
        value={status}
        options={Object.values(ProjectStatus).map((value) => ({
          value,
          label: t(PROJECT_STATUS_LABELS[value]),
        }))}
        onChange={(value) => onChange({ keyword, status: value })}
      />
    </div>
  );
}
