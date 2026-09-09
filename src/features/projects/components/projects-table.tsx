import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { Link } from '@tanstack/react-router';
import { Button, Space, Table, type TableProps } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { ProjectStatusTag } from '@/features/projects/components/project-status-tag';
import type { Project, ProjectStatus } from '@/features/projects/types';
import { formatDateTime } from '@/lib/format';

type ProjectsTableProps = {
  projects: Project[];
  loading: boolean;
  pagination: { page: number; pageSize: number; total: number };
  onPageChange: (page: number, pageSize: number) => void;
  /** Hiện khi không có dòng nào và không loading. */
  emptyState?: ReactNode;
  // undefined = không có quyền, ẩn control tương ứng.
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onStatusChange?: (project: Project, status: ProjectStatus) => void;
};

export function ProjectsTable({
  projects,
  loading,
  pagination,
  onPageChange,
  emptyState,
  onEdit,
  onDelete,
  onStatusChange,
}: ProjectsTableProps) {
  const { t } = useTranslation();

  const columns: TableProps<Project>['columns'] = [
    {
      title: t('Tên dự án'),
      dataIndex: 'name',
      render: (name: string, project) => (
        <div className="min-w-0">
          <div className="flex items-center gap-1 truncate font-medium">
            <Link to="/projects/$id" params={{ id: project.id }}>
              {name}
            </Link>
            {project.attachmentUrl ? (
              <a
                href={project.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={t('Tài liệu đính kèm')}
                className="text-[var(--text-muted)]"
              >
                <PaperClipOutlined />
              </a>
            ) : null}
          </div>
          {project.description ? (
            <div className="truncate text-xs text-[var(--text-muted)]">
              {project.description}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: t('Trạng thái'),
      dataIndex: 'status',
      width: 150,
      render: (status: ProjectStatus, project) => (
        <ProjectStatusTag
          status={status}
          onChange={
            onStatusChange ? (next) => onStatusChange(project, next) : undefined
          }
        />
      ),
    },
    { title: t('Phụ trách'), dataIndex: 'owner', width: 160 },
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
      render: (_, project) => (
        <Space size={0}>
          {onEdit ? (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              aria-label={t('Sửa {{name}}', { name: project.name })}
              onClick={() => onEdit(project)}
            />
          ) : null}
          {onDelete ? (
            <Button
              danger
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              aria-label={t('Xoá {{name}}', { name: project.name })}
              onClick={() => onDelete(project)}
            />
          ) : null}
        </Space>
      ),
    });
  }

  return (
    <Table<Project>
      rowKey="id"
      columns={columns}
      dataSource={projects}
      loading={loading}
      locale={emptyState && !loading ? { emptyText: emptyState } : undefined}
      scroll={{ x: 720 }}
      pagination={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total) => t('{{total}} dự án', { total }),
        onChange: onPageChange,
      }}
    />
  );
}
