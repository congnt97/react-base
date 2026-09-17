import { Table, type TableProps } from 'antd';
import type { ReactNode } from 'react';

import { ScrollHint } from '@/components/ui/scroll-hint';
import type { ListState } from '@/core/contracts';

type DataTableProps<TRow> = Pick<
  TableProps<TRow>,
  'columns' | 'rowKey' | 'size' | 'rowSelection' | 'expandable'
> & {
  /** State from useListQuery: loading means what it says, page overflow is already handled. */
  list: Pick<ListState<TRow>, 'items' | 'total' | 'isLoading' | 'isRefreshing'>;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  /** Required: an empty table must tell the user what to do. */
  emptyState: ReactNode;
  showTotal?: (total: number) => ReactNode;
  /** Minimum width so the table scrolls horizontally on narrow screens instead of breaking columns. */
  minWidth?: number;
};

/**
 * Standard list table: spinner delayed by 200ms (no flicker when fast), keeps stale data
 * while changing page, horizontal-scroll hint, empty state required. Features must use
 * this instead of AntD's Table.
 */
export function DataTable<TRow extends object>({
  list,
  page,
  pageSize,
  onPageChange,
  emptyState,
  showTotal,
  minWidth = 720,
  ...tableProps
}: DataTableProps<TRow>) {
  const busy = list.isLoading || list.isRefreshing;

  return (
    <ScrollHint>
      <Table<TRow>
        {...tableProps}
        rootClassName="app-data-table"
        dataSource={list.items}
        loading={{ spinning: busy, delay: 200 }}
        locale={busy ? undefined : { emptyText: emptyState }}
        scroll={{ x: minWidth }}
        pagination={{
          current: page,
          pageSize,
          total: list.total,
          showSizeChanger: true,
          showTotal,
          onChange: onPageChange,
        }}
      />
    </ScrollHint>
  );
}
