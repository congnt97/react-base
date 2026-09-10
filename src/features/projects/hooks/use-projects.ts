import { useListQuery } from '@/core/hooks/use-list-query';
import { projectsApi } from '@/features/projects/api';
import type { ProjectListParams } from '@/features/projects/types';

// Key factory: invalidate `all` sau mutation là đủ cho mọi trang/filter lẫn detail.
export const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, 'list', params] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

type UseProjectsOptions = {
  /** Xoá dòng cuối của trang cuối thì lùi về trang còn dữ liệu. */
  onPageOverflow: (lastPage: number) => void;
};

export function useProjects(
  params: ProjectListParams,
  { onPageOverflow }: UseProjectsOptions,
) {
  return useListQuery({
    queryKey: projectKeys.list(params),
    queryFn: ({ signal }) => projectsApi.list(params, { signal }),
    page: params.page,
    pageSize: params.pageSize,
    onPageOverflow,
  });
}
