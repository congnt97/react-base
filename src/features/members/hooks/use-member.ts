import { queryOptions } from '@tanstack/react-query';

import { useDetailQuery } from '@/core/hooks/use-detail-query';
import { membersApi } from '@/features/members/api';
import { memberKeys } from '@/features/members/hooks/use-members';

/** Shared by the route loader (prefetch) and the hook, so they use the same key and queryFn. */
export const memberDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: memberKeys.detail(id),
    queryFn: ({ signal }) => membersApi.detail(id, { signal }),
  });

export function useMember(id: string) {
  return useDetailQuery({
    queryKey: memberKeys.detail(id),
    queryFn: ({ signal }) => membersApi.detail(id, { signal }),
  });
}
