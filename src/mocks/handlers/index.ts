import { authHandlers } from '@/mocks/handlers/auth';
import { dashboardHandlers } from '@/mocks/handlers/dashboard';
import { filesHandlers } from '@/mocks/handlers/files';
import { projectsHandlers } from '@/mocks/handlers/projects';

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...filesHandlers,
  ...projectsHandlers,
];
