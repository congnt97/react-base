import { can, type Permission } from '@/features/auth/permissions';
import { useAuthStore } from '@/features/auth/store';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  return {
    can: (...permissions: Permission[]) => can(user, ...permissions),
  };
}
