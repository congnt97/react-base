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
import { http } from '@/lib/http';

export const projectsApi = {
  list: async (params: ProjectListParams) =>
    unwrapResponse(
      await http.get<ApiResponse<PaginatedResponse<Project>>>(
        Endpoints.Projects.LIST,
        { queryParams: params },
      ),
    ),

  create: async (body: ProjectPayload) =>
    unwrapResponse(
      await http.post<ApiResponse<Project>, ProjectPayload>(
        Endpoints.Projects.LIST,
        body,
      ),
    ),

  update: async (id: string, body: ProjectPayload) =>
    unwrapResponse(
      await http.put<ApiResponse<Project>, ProjectPayload>(
        Endpoints.Projects.DETAIL,
        body,
        { urlParams: { id } },
      ),
    ),

  patch: async (id: string, body: Partial<ProjectPayload>) =>
    unwrapResponse(
      await http.patch<ApiResponse<Project>, Partial<ProjectPayload>>(
        Endpoints.Projects.DETAIL,
        body,
        { urlParams: { id } },
      ),
    ),

  remove: async (id: string) => {
    await http.delete<ApiResponse<void>>(Endpoints.Projects.DETAIL, undefined, {
      urlParams: { id },
    });
  },
};
