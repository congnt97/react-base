import { useState } from 'react';

import {
  useCreateProject,
  useUpdateProject,
} from '@/features/projects/hooks/use-project-mutations';
import type { Project, ProjectPayload } from '@/features/projects/types';

type FormState = { open: boolean; project: Project | null };

/**
 * Bundles the create/edit modal's state and submit flow so the page only wires up UI.
 * Create vs. edit is decided by which `project` is open.
 */
export function useProjectForm() {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const [state, setState] = useState<FormState>({
    open: false,
    project: null,
  });

  const close = () => setState({ open: false, project: null });

  // The error is already toasted in the mutation hook; the Form wrapper attaches field errors and keeps the modal open.
  const submit = (values: ProjectPayload) => {
    const mutation = state.project
      ? updateProject.mutateAsync({ id: state.project.id, ...values })
      : createProject.mutateAsync(values);
    return mutation.then(close);
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
