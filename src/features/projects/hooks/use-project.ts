import { queryOptions } from '@tanstack/react-query';

import { useDetailQuery } from '@/core/hooks/use-detail-query';
import { projectsApi } from '@/features/projects/api';
import { projectKeys } from '@/features/projects/hooks/use-projects';

/** Shared by the route loader (prefetch) and the hook, so they use the same key and queryFn. */
export const projectDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: projectKeys.detail(id),
    queryFn: ({ signal }) => projectsApi.detail(id, { signal }),
  });

export function useProject(id: string | undefined) {
  return useDetailQuery({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: ({ signal }) => projectsApi.detail(id ?? '', { signal }),
    // Doesn't call the API without an id (e.g. waiting on a param); isLoading doesn't get stuck true.
    enabled: Boolean(id),
  });
}
