import type { ReactNode } from 'react';

import { usePermissions } from '@/features/auth/hooks/use-permissions';
import type { Permission } from '@/features/auth/permissions';

type CanProps = {
  permission: Permission | Permission[];
  fallback?: ReactNode;
  children: ReactNode;
};

// Ẩn/hiện UI theo permission. Chỉ là UX guard, không thay backend authorization.
export function Can({ permission, fallback = null, children }: CanProps) {
  const { can } = usePermissions();
  const permissions = Array.isArray(permission) ? permission : [permission];

  return can(...permissions) ? children : fallback;
}
