import type {
  Project,
  ProjectListParams,
  ProjectPayload,
} from '@/features/projects/types';
import {
  unwrapResponse,
  type ApiResponse,
  type PaginatedResponse,
} from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http, type HttpRequestOptions } from '@/lib/http';

type ReadOptions = Pick<HttpRequestOptions, 'signal'>;

// Explicit contract: reading the interface tells you how the feature talks to the backend.
// Read methods take a `signal` so TanStack Query can cancel the stale request on page/filter change.
export interface ProjectsApi {
  list: (
    params: ProjectListParams,
    options?: ReadOptions,
  ) => Promise<PaginatedResponse<Project>>;
  detail: (id: string, options?: ReadOptions) => Promise<Project>;
  create: (body: ProjectPayload) => Promise<Project>;
  update: (id: string, body: ProjectPayload) => Promise<Project>;
  patch: (id: string, body: Partial<ProjectPayload>) => Promise<Project>;
  remove: (id: string) => Promise<void>;
}

export const projectsApi: ProjectsApi = {
  list: async (params, options) =>
    unwrapResponse(
      await http.get<ApiResponse<PaginatedResponse<Project>>>(
        Endpoints.Projects.LIST,
        { queryParams: params, signal: options?.signal },
      ),
    ),

  detail: async (id, options) =>
    unwrapResponse(
      await http.get<ApiResponse<Project>>(Endpoints.Projects.DETAIL, {
        urlParams: { id },
        signal: options?.signal,
      }),
    ),

  create: async (body) =>
    unwrapResponse(
      await http.post<ApiResponse<Project>, ProjectPayload>(
        Endpoints.Projects.LIST,
        body,
      ),
    ),

  update: async (id, body) =>
    unwrapResponse(
      await http.put<ApiResponse<Project>, ProjectPayload>(
        Endpoints.Projects.DETAIL,
        body,
        { urlParams: { id } },
      ),
    ),

  patch: async (id, body) =>
    unwrapResponse(
      await http.patch<ApiResponse<Project>, Partial<ProjectPayload>>(
        Endpoints.Projects.DETAIL,
        body,
        { urlParams: { id } },
      ),
    ),

  remove: async (id) => {
    await http.delete<ApiResponse<void>>(Endpoints.Projects.DETAIL, undefined, {
      urlParams: { id },
    });
  },
};
