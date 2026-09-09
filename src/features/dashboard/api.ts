import type { Activity, ActivityListParams } from '@/features/dashboard/types';
import {
  unwrapResponse,
  type ApiResponse,
  type CursorPage,
} from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http } from '@/lib/http';

// Contract tường minh: đọc interface là biết feature nói chuyện với backend thế nào.
export interface DashboardApi {
  activity: (params: ActivityListParams) => Promise<CursorPage<Activity>>;
}

export const dashboardApi: DashboardApi = {
  activity: async (params) =>
    unwrapResponse(
      await http.get<ApiResponse<CursorPage<Activity>>>(
        Endpoints.Dashboard.ACTIVITY,
        { queryParams: params },
      ),
    ),
};
