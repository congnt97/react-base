import { queryOptions } from '@tanstack/react-query';

import { useDetailQuery } from '@/core/hooks/use-detail-query';
import { membersApi } from '@/features/members/api';
import { memberKeys } from '@/features/members/hooks/use-members';

/** Dùng chung cho route loader (prefetch) và hook, để cùng key và cùng queryFn. */
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
