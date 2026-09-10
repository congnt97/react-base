import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { SearchInput } from '@/components/ui/search-input';
import type { MembersSearch } from '@/features/members/search';
import {
  MEMBER_ROLES,
  MEMBER_ROLE_LABELS,
  MEMBER_STATUSES,
  MEMBER_STATUS_LABELS,
} from '@/features/members/types';

type Filter = Pick<MembersSearch, 'keyword' | 'role' | 'status'>;

type MembersFilterProps = Filter & {
  onChange: (filter: Filter) => void;
};

export function MembersFilter({
  keyword,
  role,
  status,
  onChange,
}: MembersFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SearchInput
        // key theo keyword để input reset đúng khi URL đổi từ bên ngoài (back/forward).
        key={keyword ?? ''}
        className="sm:max-w-[320px]"
        defaultValue={keyword}
        placeholder={t('Tìm theo tên hoặc email')}
        aria-label={t('Tìm theo tên hoặc email')}
        onSearch={(value) => onChange({ keyword: value, role, status })}
      />
      <Select
        allowClear
        className="sm:w-[160px]"
        placeholder={t('Vai trò')}
        aria-label={t('Vai trò')}
        value={role}
        options={MEMBER_ROLES.map((value) => ({
          value,
          label: t(MEMBER_ROLE_LABELS[value]),
        }))}
        onChange={(value) => onChange({ keyword, role: value, status })}
      />
      <Select
        allowClear
        className="sm:w-[180px]"
        placeholder={t('Trạng thái')}
        aria-label={t('Trạng thái')}
        value={status}
        options={MEMBER_STATUSES.map((value) => ({
          value,
          label: t(MEMBER_STATUS_LABELS[value]),
        }))}
        onChange={(value) => onChange({ keyword, role, status: value })}
      />
    </div>
  );
}
