import { PlusOutlined } from '@ant-design/icons';
import { getRouteApi } from '@tanstack/react-router';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

import { ErrorState } from '@/components/feedback/error-state';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/use-confirm';
import { Can } from '@/features/auth/components/can';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { ProjectFormModal } from '@/features/projects/components/project-form-modal';
import { ProjectsEmptyState } from '@/features/projects/components/projects-empty-state';
import { ProjectsFilter } from '@/features/projects/components/projects-filter';
import { ProjectsTable } from '@/features/projects/components/projects-table';
import { useProjectForm } from '@/features/projects/hooks/use-project-form';
import {
  useDeleteProject,
  useUpdateProjectStatus,
} from '@/features/projects/hooks/use-project-mutations';
import { useProjects } from '@/features/projects/hooks/use-projects';
import type { ProjectsSearch } from '@/features/projects/search';
import type { Project } from '@/features/projects/types';
import { Permission } from '@/features/auth/permissions';

const route = getRouteApi('/_app/projects/');

export function ProjectsPage() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { can } = usePermissions();
  const search = route.useSearch();
  const navigate = route.useNavigate();

  // URL là source of truth cho filter/pagination: share link, back/forward đều đúng.
  const updateSearch = (patch: Partial<ProjectsSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const projects = useProjects(search, {
    onPageOverflow: (page) => void updateSearch({ page }),
  });
  const form = useProjectForm();
  const updateStatus = useUpdateProjectStatus();
  const deleteProject = useDeleteProject();

  const canCreate = can(Permission.PROJECTS_CREATE);
  const canUpdate = can(Permission.PROJECTS_UPDATE);
  const canDelete = can(Permission.PROJECTS_DELETE);
  const hasFilter = Boolean(search.keyword ?? search.status);

  const confirmDelete = (project: Project) =>
    confirm({
      title: t('Xoá dự án "{{name}}"?', { name: project.name }),
      content: t('Hành động này không thể hoàn tác.'),
      okText: t('Xoá'),
      cancelText: t('Huỷ'),
      danger: true,
      // Lỗi đã toast trong mutation; kết quả true/false không cần xử lý thêm.
      onConfirm: () => deleteProject.mutateAsync(project.id),
    });

  return (
    <>
      <PageHeader
        title={t('Dự án')}
        description={t(
          'Ví dụ CRUD đầy đủ: filter qua URL, phân trang server, form modal, xác nhận xoá, permission theo hành động.',
        )}
        actions={
          <Can permission={Permission.PROJECTS_CREATE}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={form.openCreate}
            >
              {t('Tạo dự án')}
            </Button>
          </Can>
        }
      />

      <Card className="app-card">
        <div className="flex flex-col gap-4">
          <ProjectsFilter
            keyword={search.keyword}
            status={search.status}
            onChange={(filter) => void updateSearch({ ...filter, page: 1 })}
          />

          {projects.isError ? (
            <ErrorState error={projects.error} onRetry={projects.refetch} />
          ) : (
            <ProjectsTable
              list={projects}
              page={search.page}
              pageSize={search.pageSize}
              onPageChange={(page, pageSize) =>
                void updateSearch({ page, pageSize })
              }
              emptyState={
                <ProjectsEmptyState
                  hasFilter={hasFilter}
                  onCreate={canCreate ? form.openCreate : undefined}
                />
              }
              onEdit={canUpdate ? form.openEdit : undefined}
              onStatusChange={
                canUpdate
                  ? (project, status) =>
                      updateStatus.mutate({ id: project.id, status })
                  : undefined
              }
              onDelete={
                canDelete ? (project) => void confirmDelete(project) : undefined
              }
            />
          )}
        </div>
      </Card>

      <ProjectFormModal
        open={form.open}
        project={form.project}
        submitting={form.submitting}
        onCancel={form.close}
        onSubmit={form.submit}
      />
    </>
  );
}
