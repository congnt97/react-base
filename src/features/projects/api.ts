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

// Contract tường minh: đọc interface là biết feature nói chuyện với backend thế nào.
export interface ProjectsApi {
  list: (params: ProjectListParams) => Promise<PaginatedResponse<Project>>;
  create: (body: ProjectPayload) => Promise<Project>;
  update: (id: string, body: ProjectPayload) => Promise<Project>;
  patch: (id: string, body: Partial<ProjectPayload>) => Promise<Project>;
  remove: (id: string) => Promise<void>;
}

export const projectsApi: ProjectsApi = {
  list: async (params) =>
    unwrapResponse(
      await http.get<ApiResponse<PaginatedResponse<Project>>>(
        Endpoints.Projects.LIST,
        { queryParams: params },
      ),
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
