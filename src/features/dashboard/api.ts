import type { Activity, ActivityListParams } from '@/features/dashboard/types';
import {
  unwrapResponse,
  type ApiResponse,
  type CursorPage,
} from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http } from '@/lib/http';

export const dashboardApi = {
  activity: async (params: ActivityListParams) =>
    unwrapResponse(
      await http.get<ApiResponse<CursorPage<Activity>>>(
        Endpoints.Dashboard.ACTIVITY,
        { queryParams: params },
      ),
    ),
};
