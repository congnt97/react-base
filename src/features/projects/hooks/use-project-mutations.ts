import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';

import { projectsApi } from '@/features/projects/api';
import { projectKeys } from '@/features/projects/hooks/use-projects';
import type {
  Project,
  ProjectPayload,
  ProjectStatus,
} from '@/features/projects/types';
import { getErrorMessage } from '@/lib/api-error';
import type { PaginatedResponse } from '@/lib/api-response';

function useProjectMutationFeedback(successMessage: string) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return {
    onSuccess: () => {
      message.success(t(successMessage));
      return queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
    onError: (error: unknown) => {
      message.error(t(getErrorMessage(error)));
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

type ProjectPage = PaginatedResponse<Project>;

/**
 * Mẫu optimistic update: đổi trạng thái ngay trên mọi trang list đang cache,
 * rollback nếu server lỗi, cuối cùng invalidate để đồng bộ lại.
 */
export function useUpdateProjectStatus() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      projectsApi.patch(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });
      const previous = queryClient.getQueriesData<ProjectPage>({
        queryKey: projectKeys.all,
      });

      queryClient.setQueriesData<ProjectPage>(
        { queryKey: projectKeys.all },
        (page) =>
          page && {
            ...page,
            items: page.items.map((project) =>
              project.id === id ? { ...project, status } : project,
            ),
          },
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      message.error(t(getErrorMessage(error)));
    },
    onSuccess: () => {
      message.success(t('Đã cập nhật trạng thái'));
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
