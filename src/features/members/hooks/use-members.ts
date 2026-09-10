import { useListQuery } from '@/core/hooks/use-list-query';
import { membersApi } from '@/features/members/api';
import type {
  MemberListParams,
  MemberSessionListParams,
} from '@/features/members/types';

// Key factory: invalidate `all` sau mutation là đủ cho list, detail và list con.
export const memberKeys = {
  all: ['members'] as const,
  list: (params: MemberListParams) =>
    [...memberKeys.all, 'list', params] as const,
  detail: (id: string) => [...memberKeys.all, 'detail', id] as const,
  sessions: (id: string, params: MemberSessionListParams) =>
    [...memberKeys.all, 'detail', id, 'sessions', params] as const,
};

type ListOptions = {
  /** Xoá dòng cuối của trang cuối thì lùi về trang còn dữ liệu. */
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

/** List con theo id cha: cùng key gốc để invalidate một lần là đủ. */
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
