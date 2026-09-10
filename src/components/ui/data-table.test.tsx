import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DataTable } from '@/components/ui/data-table';

type Row = { id: string; name: string };

const columns = [{ title: 'Tên', dataIndex: 'name' }];

const renderTable = (list: {
  items?: Row[];
  total?: number;
  isLoading?: boolean;
  isRefreshing?: boolean;
}) =>
  render(
    <DataTable<Row>
      rowKey="id"
      columns={columns}
      list={{
        items: list.items ?? [],
        total: list.total ?? 0,
        isLoading: list.isLoading ?? false,
        isRefreshing: list.isRefreshing ?? false,
      }}
      page={1}
      pageSize={10}
      onPageChange={vi.fn()}
      emptyState={<p>Chưa có gì, hãy tạo mới</p>}
    />,
  );

describe('DataTable', () => {
  it('trống và không tải thì hiện empty state có hướng dẫn', () => {
    renderTable({});
    expect(screen.getByText('Chưa có gì, hãy tạo mới')).toBeInTheDocument();
  });

  it('đang tải thì không hiện empty state và spinner chỉ hiện sau 200ms', async () => {
    const { container } = renderTable({ isLoading: true });

    expect(screen.queryByText('Chưa có gì, hãy tạo mới')).toBeNull();
    expect(container.querySelector('.ant-spin-spinning')).toBeNull();

    await waitFor(
      () =>
        expect(container.querySelector('.ant-spin-spinning')).not.toBeNull(),
      { timeout: 1000 },
    );
  });

  it('có dữ liệu thì render dòng', () => {
    renderTable({ items: [{ id: '1', name: 'Dự án A' }], total: 1 });
    expect(screen.getByText('Dự án A')).toBeInTheDocument();
  });
});
