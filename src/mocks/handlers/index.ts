import { authHandlers } from '@/mocks/handlers/auth';
import { projectsHandlers } from '@/mocks/handlers/projects';

export const handlers = [...authHandlers, ...projectsHandlers];
