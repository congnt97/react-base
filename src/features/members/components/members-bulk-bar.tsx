import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

type MembersBulkBarProps = {
  count: number;
  /** Returns a Promise so the Button wrapper self-loads and blocks duplicate clicks. */
  onActivate: () => Promise<void>;
  onDeactivate: () => Promise<void>;
  onClear: () => void;
};

/** Bulk-action bar: only shows when rows are selected, always has a "Clear" option. */
export function MembersBulkBar({
  count,
  onActivate,
  onDeactivate,
  onClear,
}: MembersBulkBarProps) {
  const { t } = useTranslation();

  if (count === 0) {
    return null;
  }

  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-2 rounded-md bg-[var(--primary-bg)] px-3 py-2"
    >
      <span className="mr-auto text-sm">
        {t('Đã chọn {{count}} thành viên', { count })}
      </span>
      <Button size="small" onClick={onActivate}>
        {t('Kích hoạt')}
      </Button>
      <Button size="small" danger onClick={onDeactivate}>
        {t('Vô hiệu hoá')}
      </Button>
      <Button size="small" type="text" onClick={onClear}>
        {t('Bỏ chọn')}
      </Button>
    </div>
  );
}
