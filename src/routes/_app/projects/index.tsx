import { createFileRoute } from '@tanstack/react-router';

import { ProjectsPage } from '@/features/projects/pages/projects-page';
import { projectsSearchSchema } from '@/features/projects/search';

export const Route = createFileRoute('/_app/projects/')({
  component: ProjectsPage,
  validateSearch: (search) => projectsSearchSchema.parse(search),
});
