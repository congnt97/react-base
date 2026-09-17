import { useListQuery } from '@/core/hooks/use-list-query';
import { membersApi } from '@/features/members/api';
import type {
  MemberListParams,
  MemberSessionListParams,
} from '@/features/members/types';

// Key factory: invalidating `all` after a mutation is enough for the list, detail, and sub-lists.
export const memberKeys = {
  all: ['members'] as const,
  list: (params: MemberListParams) =>
    [...memberKeys.all, 'list', params] as const,
  detail: (id: string) => [...memberKeys.all, 'detail', id] as const,
  sessions: (id: string, params: MemberSessionListParams) =>
    [...memberKeys.all, 'detail', id, 'sessions', params] as const,
};

type ListOptions = {
  /** Deleting the last row of the last page steps back to a page that still has data. */
  onPageOverflow: (lastPage: number) => void;
};

export function useMembers(
  params: MemberListParams,
  { onPageOverflow }: ListOptions,
) {
  return useListQuery({
    queryKey: memberKeys.list(params),
    queryFn: ({ signal }) => membersApi.list(params, { signal }),
    page: params.page,
    pageSize: params.pageSize,
    onPageOverflow,
  });
}

/** Sub-list keyed by the parent id: shares the root key, so a single invalidate is enough. */
export function useMemberSessions(
  id: string,
  params: MemberSessionListParams,
  { onPageOverflow }: ListOptions,
) {
  return useListQuery({
    queryKey: memberKeys.sessions(id, params),
    queryFn: ({ signal }) => membersApi.listSessions(id, params, { signal }),
    page: params.page,
    pageSize: params.pageSize,
    onPageOverflow,
  });
}
