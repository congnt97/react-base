import { z } from 'zod';

import { ProjectStatus } from '@/features/projects/types';

// `.catch` instead of throw: a bad/missing query param falls back to the default instead of a route error.
export const projectsSearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  pageSize: z.number().int().min(1).max(100).catch(10),
  keyword: z.string().trim().min(1).optional().catch(undefined),
  status: z.enum(ProjectStatus).optional().catch(undefined),
});

export type ProjectsSearch = z.infer<typeof projectsSearchSchema>;
