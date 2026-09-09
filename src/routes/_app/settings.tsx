import { createFileRoute } from '@tanstack/react-router';

import { requireRole } from '@/features/auth/guards';
import { Role } from '@/features/auth/types';
import { SettingsPage } from '@/features/settings/pages/settings-page';

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
  // Throw ForbiddenError -> defaultErrorComponent (RouteError) render trang 403.
  beforeLoad: () => requireRole(Role.ADMIN),
});
