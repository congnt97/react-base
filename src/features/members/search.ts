import { z } from 'zod';

import { MEMBER_ROLES, MEMBER_STATUSES } from '@/features/members/types';

// `.catch` thay vì throw: query param sai/thiếu thì về mặc định, không văng lỗi route.
export const membersSearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  pageSize: z.number().int().min(1).max(100).catch(10),
  keyword: z.string().trim().min(1).optional().catch(undefined),
  role: z.enum(MEMBER_ROLES).optional().catch(undefined),
  status: z.enum(MEMBER_STATUSES).optional().catch(undefined),
});

export type MembersSearch = z.infer<typeof membersSearchSchema>;

/** Bảng con trên trang chi tiết cũng phân trang qua URL, để share link đúng trang. */
export const memberSessionsSearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  pageSize: z.number().int().min(1).max(50).catch(5),
});

/** Input khi điều hướng: mọi field tuỳ chọn, schema điền mặc định. */
export type MemberSessionsSearchInput = Partial<
  z.infer<typeof memberSessionsSearchSchema>
>;
