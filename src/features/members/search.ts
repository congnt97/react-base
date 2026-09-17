import { z } from 'zod';

import { MemberRole, MemberStatus } from '@/features/members/types';

// `.catch` instead of throw: a bad/missing query param falls back to the default instead of a route error.
export const membersSearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  pageSize: z.number().int().min(1).max(100).catch(10),
  keyword: z.string().trim().min(1).optional().catch(undefined),
  role: z.enum(MemberRole).optional().catch(undefined),
  status: z.enum(MemberStatus).optional().catch(undefined),
});

export type MembersSearch = z.infer<typeof membersSearchSchema>;

/** The sub-table on the detail page also paginates via the URL, so a shared link opens the right page. */
export const memberSessionsSearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  pageSize: z.number().int().min(1).max(50).catch(5),
});

/** Input for navigation: every field optional, the schema fills in defaults. */
export type MemberSessionsSearchInput = Partial<
  z.infer<typeof memberSessionsSearchSchema>
>;
