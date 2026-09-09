import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { SearchInput } from '@/components/ui/search-input';
import type { ProjectsSearch } from '@/features/projects/search';
import {
  PROJECT_STATUSES,
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
        // key theo keyword để input reset đúng khi URL đổi từ bên ngoài (back/forward).
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
        options={PROJECT_STATUSES.map((value) => ({
          value,
          label: t(PROJECT_STATUS_LABELS[value]),
        }))}
        onChange={(value) => onChange({ keyword, status: value })}
      />
    </div>
  );
}
