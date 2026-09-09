import { delay, http } from 'msw';

import type { Activity } from '@/features/dashboard/types';
import { Endpoints } from '@/lib/endpoints';
import { apiUrl, ok } from '@/mocks/utils';

const ACTORS = ['Lan', 'Minh', 'Hà', 'Tuấn', 'Ngọc'];
const MESSAGES = [
  'đã tạo dự án mới',
  'đã đổi trạng thái dự án',
  'đã cập nhật mô tả',
  'đã tải lên tài liệu',
  'đã xoá một dự án',
];

const activities: Activity[] = Array.from({ length: 45 }, (_, index) => ({
  id: `a${index + 1}`,
  actor: ACTORS[index % ACTORS.length],
  message: MESSAGES[index % MESSAGES.length],
  createdAt: new Date(Date.now() - index * 37 * 60_000).toISOString(),
}));

export const dashboardHandlers = [
  http.get(apiUrl(Endpoints.Dashboard.ACTIVITY), async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const start = Number(url.searchParams.get('cursor') ?? 0);
    const end = start + limit;

    return ok({
      items: activities.slice(start, end),
      nextCursor: end < activities.length ? String(end) : null,
    });
  }),
];
