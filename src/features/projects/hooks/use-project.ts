import { queryOptions, useQuery } from '@tanstack/react-query';

import { projectsApi } from '@/features/projects/api';
import { projectKeys } from '@/features/projects/hooks/use-projects';

export const projectDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.detail(id),
  });

export function useProject(id: string | undefined) {
  return useQuery({
    ...projectDetailQueryOptions(id ?? ''),
    // Không gọi API khi chưa có id (vd đang chờ param).
    enabled: Boolean(id),
  });
}
