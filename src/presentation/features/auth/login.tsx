import { AuthLayout } from '@/presentation/layouts/auth/auth-layout';
import { LoginForm } from '@/presentation/features/auth/containers/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
