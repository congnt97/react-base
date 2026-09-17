import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { Space, type TableProps } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ListState } from '@/core/contracts';
import {
  MemberRoleTag,
  MemberStatusTag,
} from '@/features/members/components/member-tags';
import type { Member } from '@/features/members/types';
import { formatDateTime } from '@/lib/format';

type MembersTableProps = {
  list: ListState<Member>;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  emptyState: ReactNode;
  /** When present, the table shows a selection column; undefined = no permission for bulk actions. */
  selection?: { ids: string[]; onChange: (ids: string[]) => void };
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
};

export function MembersTable({
  list,
  page,
  pageSize,
  onPageChange,
  emptyState,
  selection,
  onEdit,
  onDelete,
}: MembersTableProps) {
  const { t } = useTranslation();

  const columns: TableProps<Member>['columns'] = [
    {
      title: t('Thành viên'),
      dataIndex: 'name',
      render: (name: string, member) => (
        <div className="min-w-0">
          <Link
            to="/members/$id"
            params={{ id: member.id }}
            className="font-medium"
          >
            {name}
          </Link>
          <div className="truncate text-xs text-[var(--text-muted)]">
            {member.email}
          </div>
        </div>
      ),
    },
    {
      title: t('Vai trò'),
      dataIndex: 'role',
      width: 120,
      render: (role: Member['role']) => <MemberRoleTag role={role} />,
    },
    {
      title: t('Trạng thái'),
      dataIndex: 'status',
      width: 160,
      render: (status: Member['status']) => <MemberStatusTag status={status} />,
    },
    {
      title: t('Quản lý'),
      dataIndex: 'managerName',
      width: 140,
      render: (value?: string) => value ?? '—',
    },
    {
      title: t('Cập nhật'),
      dataIndex: 'updatedAt',
      width: 160,
      render: (value: string) => formatDateTime(value),
    },
  ];

  if (onEdit || onDelete) {
    columns.push({
      title: '',
      key: 'actions',
      width: 96,
      align: 'right',
      render: (_, member) => (
        <Space size={0}>
          {onEdit ? (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              aria-label={t('Sửa {{name}}', { name: member.name })}
              onClick={() => onEdit(member)}
            />
          ) : null}
          {onDelete ? (
            <Button
              danger
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              aria-label={t('Xoá {{name}}', { name: member.name })}
              onClick={() => onDelete(member)}
            />
          ) : null}
        </Space>
      ),
    });
  }

  return (
    <DataTable<Member>
      rowKey="id"
      columns={columns}
      list={list}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      emptyState={emptyState}
      minWidth={880}
      showTotal={(total) => t('{{total}} thành viên', { total })}
      rowSelection={
        selection
          ? {
              selectedRowKeys: selection.ids,
              onChange: (keys) => selection.onChange(keys.map(String)),
            }
          : undefined
      }
    />
  );
}
