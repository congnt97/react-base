import { queryOptions } from '@tanstack/react-query';

import { useDetailQuery } from '@/core/hooks/use-detail-query';
import { projectsApi } from '@/features/projects/api';
import { projectKeys } from '@/features/projects/hooks/use-projects';

/** Dùng chung cho route loader (prefetch) và hook, để cùng key và cùng queryFn. */
export const projectDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: projectKeys.detail(id),
    queryFn: ({ signal }) => projectsApi.detail(id, { signal }),
  });

export function useProject(id: string | undefined) {
  return useDetailQuery({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: ({ signal }) => projectsApi.detail(id ?? '', { signal }),
    // Không gọi API khi chưa có id (vd đang chờ param); isLoading không kẹt true.
    enabled: Boolean(id),
  });
}
