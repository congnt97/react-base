import { EditOutlined } from '@ant-design/icons';
import { getRouteApi } from '@tanstack/react-router';
import { Card, Descriptions } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorState } from '@/components/feedback/error-state';
import { PageLoading } from '@/components/feedback/page-loading';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Can } from '@/features/auth/components/can';
import { ProjectFormModal } from '@/features/projects/components/project-form-modal';
import { ProjectStatusTag } from '@/features/projects/components/project-status-tag';
import { useProject } from '@/features/projects/hooks/use-project';
import { useUpdateProject } from '@/features/projects/hooks/use-project-mutations';
import type { ProjectPayload } from '@/features/projects/types';
import { formatDateTime } from '@/lib/format';
import { Permission } from '@/features/auth/permissions';

const route = getRouteApi('/_app/projects/$id');

export function ProjectDetailPage() {
  const { t } = useTranslation();
  const { id } = route.useParams();
  // The loader already called ensureQueryData, so data is available on the very first render; the hook keeps the cache in sync after mutations.
  const project = useProject(id);
  const updateProject = useUpdateProject();
  const [editing, setEditing] = useState(false);

  if (project.isLoading) {
    return <PageLoading />;
  }

  if (project.isError) {
    return <ErrorState error={project.error} onRetry={project.refetch} />;
  }

  const data = project.data;
  if (!data) {
    return <PageLoading />;
  }

  // The error is already toasted in the mutation; the Form wrapper attaches field errors and keeps the modal open.
  const handleSubmit = (values: ProjectPayload) =>
    updateProject
      .mutateAsync({ id: data.id, ...values })
      .then(() => setEditing(false));

  return (
    <>
      <PageHeader
        title={data.name}
        description={data.description}
        breadcrumbs={[
          { label: t('Dự án'), to: '/projects' },
          { label: data.name },
        ]}
        actions={
          <Can permission={Permission.PROJECTS_UPDATE}>
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
              {t('Sửa dự án')}
            </Button>
          </Can>
        }
      />

      <Card className="app-card">
        <Descriptions
          column={{ xs: 1, md: 2 }}
          items={[
            {
              key: 'status',
              label: t('Trạng thái'),
              children: <ProjectStatusTag status={data.status} />,
            },
            { key: 'owner', label: t('Phụ trách'), children: data.owner },
            {
              key: 'attachment',
              label: t('Tài liệu đính kèm'),
              children: data.attachmentUrl ? (
                <a href={data.attachmentUrl} target="_blank" rel="noreferrer">
                  {data.attachmentUrl.split('/').pop()}
                </a>
              ) : (
                t('Không có')
              ),
            },
            {
              key: 'createdAt',
              label: t('Ngày tạo'),
              children: formatDateTime(data.createdAt),
            },
            {
              key: 'updatedAt',
              label: t('Cập nhật'),
              children: formatDateTime(data.updatedAt),
            },
          ]}
        />
      </Card>

      <ProjectFormModal
        open={editing}
        project={data}
        submitting={updateProject.isPending}
        onCancel={() => setEditing(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
