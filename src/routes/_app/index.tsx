import { createFileRoute } from '@tanstack/react-router';

import { DashboardPage } from '@/presentation/features/dashboard/dashboard-page';

export const Route = createFileRoute('/_app/')({
  component: DashboardPage,
});
