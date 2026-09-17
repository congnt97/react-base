import type { TableProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/feedback/empty-state';
import { DataTable } from '@/components/ui/data-table';
import type { ListState } from '@/core/contracts';
import type { MemberSession } from '@/features/members/types';
import { formatDateTime } from '@/lib/format';

type MemberSessionsTableProps = {
  list: ListState<MemberSession>;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
};

/** Sub-table on the detail page: same DataTable, its own pagination in the URL. */
export function MemberSessionsTable({
  list,
  page,
  pageSize,
  onPageChange,
}: MemberSessionsTableProps) {
  const { t } = useTranslation();

  const columns: TableProps<MemberSession>['columns'] = [
    { title: t('Thiết bị'), dataIndex: 'device' },
    { title: t('Địa chỉ IP'), dataIndex: 'ip', width: 160 },
    {
      title: t('Thời gian'),
      dataIndex: 'createdAt',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
  ];

  return (
    <DataTable<MemberSession>
      rowKey="id"
      size="small"
      columns={columns}
      list={list}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      minWidth={520}
      emptyState={<EmptyState title={t('Chưa có phiên đăng nhập nào')} />}
      showTotal={(total) => t('{{total}} phiên', { total })}
    />
  );
}
