import { useListQuery } from '@/core/hooks/use-list-query';
import { projectsApi } from '@/features/projects/api';
import type { ProjectListParams } from '@/features/projects/types';

// Key factory: invalidating `all` after a mutation is enough for every page/filter and detail.
export const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, 'list', params] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

type UseProjectsOptions = {
  /** Deleting the last row of the last page steps back to a page that still has data. */
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
