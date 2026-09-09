import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Table, type TableProps } from 'antd';
import dayjs from 'dayjs';

import { ProjectStatusTag } from '@/features/projects/components/project-status-tag';
import type { Project } from '@/features/projects/types';

type ProjectsTableProps = {
  projects: Project[];
  loading: boolean;
  pagination: { page: number; pageSize: number; total: number };
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export function ProjectsTable({
  projects,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  const columns: TableProps<Project>['columns'] = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
      render: (name: string, project) => (
        <div className="min-w-0">
          <div className="truncate font-medium">{name}</div>
          {project.description ? (
            <div className="truncate text-xs text-[var(--text-muted)]">
              {project.description}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (status: Project['status']) => (
        <ProjectStatusTag status={status} />
      ),
    },
    { title: 'Phụ trách', dataIndex: 'owner', width: 160 },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      width: 160,
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: '',
      key: 'actions',
      width: 96,
      align: 'right',
      render: (_, project) => (
        <Space size={0}>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            aria-label={`Sửa ${project.name}`}
            onClick={() => onEdit(project)}
          />
          <Button
            danger
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            aria-label={`Xoá ${project.name}`}
            onClick={() => onDelete(project)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table<Project>
      rowKey="id"
      columns={columns}
      dataSource={projects}
      loading={loading}
      scroll={{ x: 720 }}
      pagination={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `${total} dự án`,
        onChange: onPageChange,
      }}
    />
  );
}
