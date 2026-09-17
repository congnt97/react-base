import type { Activity, ActivityListParams } from '@/features/dashboard/types';
import {
  unwrapResponse,
  type ApiResponse,
  type CursorPage,
} from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http, type HttpRequestOptions } from '@/lib/http';

// Explicit contract: reading the interface tells you how the feature talks to the backend.
export interface DashboardApi {
  activity: (
    params: ActivityListParams,
    options?: Pick<HttpRequestOptions, 'signal'>,
  ) => Promise<CursorPage<Activity>>;
}

export const dashboardApi: DashboardApi = {
  activity: async (params, options) =>
    unwrapResponse(
      await http.get<ApiResponse<CursorPage<Activity>>>(
        Endpoints.Dashboard.ACTIVITY,
        { queryParams: params, signal: options?.signal },
      ),
    ),
};
