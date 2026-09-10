import { Table, type TableProps } from 'antd';
import type { ReactNode } from 'react';

import { ScrollHint } from '@/components/ui/scroll-hint';
import type { ListState } from '@/core/contracts';

type DataTableProps<TRow> = Pick<
  TableProps<TRow>,
  'columns' | 'rowKey' | 'size' | 'rowSelection' | 'expandable'
> & {
  /** Trạng thái từ useListQuery: loading đúng nghĩa, trang tràn đã được lo. */
  list: Pick<ListState<TRow>, 'items' | 'total' | 'isLoading' | 'isRefreshing'>;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  /** Bắt buộc: bảng trống phải nói người dùng nên làm gì. */
  emptyState: ReactNode;
  showTotal?: (total: number) => ReactNode;
  /** Chiều rộng tối thiểu để bảng cuộn ngang trên màn hẹp thay vì vỡ cột. */
  minWidth?: number;
};

/**
 * Bảng list chuẩn: spinner trễ 200ms (không nháy khi nhanh), giữ data cũ khi đổi trang,
 * gợi ý cuộn ngang, empty state bắt buộc. Feature phải dùng bản này thay vì antd Table.
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
