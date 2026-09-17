import { createFileRoute, notFound } from '@tanstack/react-router';

import { projectDetailQueryOptions } from '@/features/projects/hooks/use-project';
import { ProjectDetailPage } from '@/features/projects/pages/project-detail-page';
import { ApiError } from '@/lib/api-error';

export const Route = createFileRoute('/_app/projects/$id')({
  component: ProjectDetailPage,
  // Prefetches before render to avoid a loading flash; a 404 from the API becomes the Not Found page.
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
