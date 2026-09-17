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
import { Permission } from '@/features/auth/permissions';

export const Route = createFileRoute('/_app/members/$id')({
  component: MemberDetailPage,
  beforeLoad: () => requirePermission(Permission.MEMBERS_READ),
  // The sub-table paginates via the URL: ?page=2 reopens the right page.
  // SearchSchemaInput: a Link to this page isn't required to pass page/pageSize.
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
