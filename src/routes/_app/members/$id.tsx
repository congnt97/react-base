import {
  createFileRoute,
  notFound,
  type SearchSchemaInput,
} from '@tanstack/react-router';

import { requirePermission } from '@/features/auth/guards';
import { memberDetailQueryOptions } from '@/features/members/hooks/use-member';
import { MemberDetailPage } from '@/features/members/pages/member-detail-page';
import {
  memberSessionsSearchSchema,
  type MemberSessionsSearchInput,
} from '@/features/members/search';
import { ApiError } from '@/lib/api-error';

export const Route = createFileRoute('/_app/members/$id')({
  component: MemberDetailPage,
  beforeLoad: () => requirePermission('members:read'),
  // Bảng con phân trang trên URL: ?page=2 mở lại đúng trang.
  // SearchSchemaInput: Link tới trang này không bắt buộc truyền page/pageSize.
  validateSearch: (search: MemberSessionsSearchInput & SearchSchemaInput) =>
    memberSessionsSearchSchema.parse(search),
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(
        memberDetailQueryOptions(params.id),
      );
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        throw notFound();
      }
      throw error;
    }
  },
});
