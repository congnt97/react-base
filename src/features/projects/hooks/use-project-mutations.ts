import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';

import { projectsApi } from '@/features/projects/api';
import { projectKeys } from '@/features/projects/hooks/use-projects';
import type { ProjectPayload } from '@/features/projects/types';
import { getErrorMessage } from '@/lib/api-error';

function useProjectMutationFeedback(successMessage: string) {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return {
    onSuccess: () => {
      message.success(successMessage);
      return queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
    onError: (error: unknown) => {
      message.error(getErrorMessage(error));
    },
  };
}

export function useCreateProject() {
  return useMutation({
    mutationFn: projectsApi.create,
    ...useProjectMutationFeedback('Đã tạo dự án'),
  });
}

export function useUpdateProject() {
  return useMutation({
    mutationFn: ({ id, ...body }: ProjectPayload & { id: string }) =>
      projectsApi.update(id, body),
    ...useProjectMutationFeedback('Đã cập nhật dự án'),
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: projectsApi.remove,
    ...useProjectMutationFeedback('Đã xoá dự án'),
  });
}
