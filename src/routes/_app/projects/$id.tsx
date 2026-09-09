import { createFileRoute, notFound } from '@tanstack/react-router';

import { projectDetailQueryOptions } from '@/features/projects/hooks/use-project';
import { ProjectDetailPage } from '@/features/projects/pages/project-detail-page';
import { ApiError } from '@/lib/api-error';

export const Route = createFileRoute('/_app/projects/$id')({
  component: ProjectDetailPage,
  // Prefetch trước khi render để không nháy loading; 404 từ API thành trang Not Found.
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(
        projectDetailQueryOptions(params.id),
      );
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        throw notFound();
      }
      throw error;
    }
  },
});
