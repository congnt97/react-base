import type {
  Member,
  MemberListParams,
  MemberPayload,
  MemberSession,
  MemberSessionListParams,
  MemberStatusPayload,
} from '@/features/members/types';
import {
  unwrapResponse,
  type ApiResponse,
  type PaginatedResponse,
} from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http, type HttpRequestOptions } from '@/lib/http';

type ReadOptions = Pick<HttpRequestOptions, 'signal'>;

// Explicit contract. Besides list/detail/create/update/patch/remove there's also:
// - `patchMany`: a bulk action, one request for many ids.
// - `listSessions`: a sub-list keyed by the parent id.
export interface MembersApi {
  list: (
    params: MemberListParams,
    options?: ReadOptions,
  ) => Promise<PaginatedResponse<Member>>;
  detail: (id: string, options?: ReadOptions) => Promise<Member>;
  create: (body: MemberPayload) => Promise<Member>;
  update: (id: string, body: MemberPayload) => Promise<Member>;
  patchMany: (body: MemberStatusPayload) => Promise<void>;
  remove: (id: string) => Promise<void>;
  listSessions: (
    id: string,
    params: MemberSessionListParams,
    options?: ReadOptions,
  ) => Promise<PaginatedResponse<MemberSession>>;
}

export const membersApi: MembersApi = {
  list: async (params, options) =>
    unwrapResponse(
      await http.get<ApiResponse<PaginatedResponse<Member>>>(
        Endpoints.Members.LIST,
        { queryParams: params, signal: options?.signal },
      ),
    ),

  detail: async (id, options) =>
    unwrapResponse(
      await http.get<ApiResponse<Member>>(Endpoints.Members.DETAIL, {
        urlParams: { id },
        signal: options?.signal,
      }),
    ),

  create: async (body) =>
    unwrapResponse(
      await http.post<ApiResponse<Member>, MemberPayload>(
        Endpoints.Members.LIST,
        body,
      ),
    ),

  update: async (id, body) =>
    unwrapResponse(
      await http.put<ApiResponse<Member>, MemberPayload>(
        Endpoints.Members.DETAIL,
        body,
        { urlParams: { id } },
      ),
    ),

  patchMany: async (body) => {
    await http.patch<ApiResponse<void>, MemberStatusPayload>(
      Endpoints.Members.STATUS,
      body,
    );
  },

  remove: async (id) => {
    await http.delete<ApiResponse<void>>(Endpoints.Members.DETAIL, undefined, {
      urlParams: { id },
    });
  },

  listSessions: async (id, params, options) =>
    unwrapResponse(
      await http.get<ApiResponse<PaginatedResponse<MemberSession>>>(
        Endpoints.Members.SESSIONS,
        { urlParams: { id }, queryParams: params, signal: options?.signal },
      ),
    ),
};
