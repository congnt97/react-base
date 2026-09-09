import { z } from 'zod';

import { PROJECT_STATUSES } from '@/features/projects/types';

// `.catch` thay vì throw: query param sai/thiếu thì về mặc định, không văng lỗi route.
export const projectsSearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  pageSize: z.number().int().min(1).max(100).catch(10),
  keyword: z.string().trim().min(1).optional().catch(undefined),
  status: z.enum(PROJECT_STATUSES).optional().catch(undefined),
});

export type ProjectsSearch = z.infer<typeof projectsSearchSchema>;
