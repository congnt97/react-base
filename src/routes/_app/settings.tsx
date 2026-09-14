import { createFileRoute } from '@tanstack/react-router';

import { requirePermission } from '@/features/auth/guards';
import { SettingsPage } from '@/features/settings/pages/settings-page';
import { Permission } from '@/features/auth/permissions';

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
  // Throw ForbiddenError -> defaultErrorComponent (RouteError) render trang 403.
  beforeLoad: () => requirePermission(Permission.SETTINGS_MANAGE),
});
