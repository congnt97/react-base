import { createFileRoute } from '@tanstack/react-router';

import { requirePermission } from '@/features/auth/guards';
import { MembersPage } from '@/features/members/pages/members-page';
import { membersSearchSchema } from '@/features/members/search';
import { Permission } from '@/features/auth/permissions';

export const Route = createFileRoute('/_app/members/')({
  component: MembersPage,
  beforeLoad: () => requirePermission(Permission.MEMBERS_READ),
  validateSearch: (search) => membersSearchSchema.parse(search),
});
