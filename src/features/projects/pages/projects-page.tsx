import { PlusOutlined } from '@ant-design/icons';
import { getRouteApi } from '@tanstack/react-router';
import { App, Button, Card } from 'antd';
import { useState } from 'react';

import { ErrorState } from '@/components/feedback/error-state';
import { PageHeader } from '@/components/layout/page-header';
import { ProjectFormModal } from '@/features/projects/components/project-form-modal';
import { ProjectsFilter } from '@/features/projects/components/projects-filter';
import { ProjectsTable } from '@/features/projects/components/projects-table';
import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from '@/features/projects/hooks/use-project-mutations';
import { useProjects } from '@/features/projects/hooks/use-projects';
import type { ProjectsSearch } from '@/features/projects/search';
import type { Project, ProjectPayload } from '@/features/projects/types';

const route = getRouteApi('/_app/projects');

type FormState = { open: boolean; project: Project | null };

export function ProjectsPage() {
  const { modal } = App.useApp();
  const search = route.useSearch();
  const navigate = route.useNavigate();

  // URL là source of truth cho filter/pagination: share link, back/forward đều đúng.
  const updateSearch = (patch: Partial<ProjectsSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const projects = useProjects(search);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [form, setForm] = useState<FormState>({ open: false, project: null });
  const closeForm = () => setForm({ open: false, project: null });

  const handleSubmit = (values: ProjectPayload) => {
    const mutation = form.project
      ? updateProject.mutateAsync({ id: form.project.id, ...values })
      : createProject.mutateAsync(values);
    // Lỗi đã được toast trong hook; ở đây chỉ cần giữ modal mở khi thất bại.
    void mutation.then(closeForm, () => undefined);
  };

  const confirmDelete = (project: Project) => {
    modal.confirm({
      title: `Xoá dự án "${project.name}"?`,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: () =>
        deleteProject.mutateAsync(project.id).then(
          () => undefined,
          () => undefined,
        ),
    });
  };

  return (
    <>
      <PageHeader
        title="Dự án"
        description="Ví dụ CRUD đầy đủ: filter qua URL, phân trang server, form modal, xác nhận xoá."
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setForm({ open: true, project: null })}
          >
            Tạo dự án
          </Button>
        }
      />

      <Card className="app-card">
        <div className="flex flex-col gap-4">
          <ProjectsFilter
            keyword={search.keyword}
            status={search.status}
            onChange={(filter) => updateSearch({ ...filter, page: 1 })}
          />

          {projects.isError ? (
            <ErrorState
              error={projects.error}
              onRetry={() => projects.refetch()}
            />
          ) : (
            <ProjectsTable
              projects={projects.data?.items ?? []}
              loading={projects.isPending || projects.isPlaceholderData}
              pagination={{
                page: search.page,
                pageSize: search.pageSize,
                total: projects.data?.total ?? 0,
              }}
              onPageChange={(page, pageSize) =>
                updateSearch({ page, pageSize })
              }
              onEdit={(project) => setForm({ open: true, project })}
              onDelete={confirmDelete}
            />
          )}
        </div>
      </Card>

      <ProjectFormModal
        open={form.open}
        project={form.project}
        submitting={createProject.isPending || updateProject.isPending}
        onCancel={closeForm}
        onSubmit={handleSubmit}
      />
    </>
  );
}
