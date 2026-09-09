import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from '@tanstack/react-query';

import { projectsApi } from '@/features/projects/api';
import type { ProjectListParams } from '@/features/projects/types';

// Key factory: invalidate `all` sau mutation là đủ cho mọi trang/filter lẫn detail.
export const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, 'list', params] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

const projectsQueryOptions = (params: ProjectListParams) =>
  queryOptions({
    queryKey: projectKeys.list(params),
    // `signal` huỷ request cũ khi user đổi trang/filter nhanh, tránh response lệch.
    queryFn: ({ signal }) => projectsApi.list(params, { signal }),
    // Giữ data trang cũ khi đổi trang/filter để bảng không nháy trắng.
    placeholderData: keepPreviousData,
  });

export function useProjects(params: ProjectListParams) {
  return useQuery(projectsQueryOptions(params));
}
