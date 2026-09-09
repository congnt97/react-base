import { useAuthStore } from '@/features/auth/store';
import type { AuthUser, Role } from '@/features/auth/types';

export class ForbiddenError extends Error {
  constructor() {
    super('Bạn không có quyền truy cập trang này');
    this.name = 'ForbiddenError';
  }
}

export const hasRole = (
  user: Pick<AuthUser, 'role'> | null | undefined,
  ...roles: Role[]
) => Boolean(user && roles.includes(user.role));

/**
 * Dùng trong `beforeLoad` của route cần role. Throw để `errorComponent`
 * của route render trang 403. Frontend guard chỉ là UX; backend vẫn phải enforce.
 */
export const requireRole = (...roles: Role[]) => {
  if (!hasRole(useAuthStore.getState().user, ...roles)) {
    throw new ForbiddenError();
  }
};
