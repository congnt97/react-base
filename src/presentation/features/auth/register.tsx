import { AuthLayout } from '@/presentation/layouts/auth/auth-layout';
import { RegisterForm } from '@/presentation/features/auth/containers/RegisterForm';

export function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
