import { Select } from 'antd';

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

const STATUS_OPTIONS = PROJECT_STATUSES.map((value) => ({
  value,
  label: PROJECT_STATUS_LABELS[value],
}));

export function ProjectsFilter({
  keyword,
  status,
  onChange,
}: ProjectsFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SearchInput
        // key theo keyword để input reset đúng khi URL đổi từ bên ngoài (back/forward).
        key={keyword ?? ''}
        className="sm:max-w-[320px]"
        defaultValue={keyword}
        placeholder="Tìm theo tên dự án"
        aria-label="Tìm theo tên dự án"
        onPressEnter={(event) =>
          onChange({
            keyword: event.currentTarget.value.trim() || undefined,
            status,
          })
        }
        onClear={() => onChange({ keyword: undefined, status })}
      />
      <Select
        allowClear
        className="sm:w-[180px]"
        placeholder="Trạng thái"
        aria-label="Trạng thái"
        value={status}
        options={STATUS_OPTIONS}
        onChange={(value) => onChange({ keyword, status: value })}
      />
    </div>
  );
}
