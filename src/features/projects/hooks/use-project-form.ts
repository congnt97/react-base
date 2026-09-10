import { useState } from 'react';

import {
  useCreateProject,
  useUpdateProject,
} from '@/features/projects/hooks/use-project-mutations';
import type { Project, ProjectPayload } from '@/features/projects/types';

type FormState = { open: boolean; project: Project | null };

/**
 * Gom state và luồng submit của modal tạo/sửa để page chỉ còn nối UI.
 * Tạo hay sửa quyết định bởi `project` đang mở.
 */
export function useProjectForm() {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const [state, setState] = useState<FormState>({
    open: false,
    project: null,
  });

  const close = () => setState({ open: false, project: null });

  const submit = (values: ProjectPayload) => {
    const mutation = state.project
      ? updateProject.mutateAsync({ id: state.project.id, ...values })
      : createProject.mutateAsync(values);
    // Lỗi đã được toast trong hook mutation; ở đây chỉ giữ modal mở khi thất bại.
    void mutation.then(close, () => undefined);
  };

  return {
    open: state.open,
    project: state.project,
    submitting: createProject.isPending || updateProject.isPending,
    openCreate: () => setState({ open: true, project: null }),
    openEdit: (project: Project) => setState({ open: true, project }),
    close,
    submit,
  };
}
