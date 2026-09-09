import { createFileRoute } from '@tanstack/react-router';

import { LoginPage } from '@/features/auth/pages/login-page';
import { loginSearchSchema } from '@/features/auth/search';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
  validateSearch: loginSearchSchema,
});
