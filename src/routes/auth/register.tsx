import { createFileRoute } from '@tanstack/react-router';

import { RegisterPage } from '@/presentation/features/auth/register-page';

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});
