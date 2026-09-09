import { createFileRoute } from '@tanstack/react-router';

import { LoginPage } from '@/presentation/features/auth/login-page';
import { redirectToSearchSchema } from '@/shared/validations/common/redirectTo';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
  validateSearch: redirectToSearchSchema,
});
