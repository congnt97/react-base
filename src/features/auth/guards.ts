import { can, type Permission } from '@/features/auth/permissions';
import { useAuthStore } from '@/features/auth/store';

export class ForbiddenError extends Error {
  constructor() {
    super('Bạn không có quyền truy cập trang này');
    this.name = 'ForbiddenError';
  }
}

/**
 * Dùng trong `beforeLoad` của route cần permission. Throw để
 * `defaultErrorComponent` (RouteError) render trang 403.
 * Frontend guard chỉ là UX; backend vẫn phải enforce.
 */
export const requirePermission = (...permissions: Permission[]) => {
  if (!can(useAuthStore.getState().user, ...permissions)) {
    throw new ForbiddenError();
  }
};
