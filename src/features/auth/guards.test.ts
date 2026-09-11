import { beforeEach, describe, expect, it } from 'vitest';

import { ForbiddenError, requirePermission } from '@/features/auth/guards';
import { useAuthStore } from '@/features/auth/store';
import type { AuthUser } from '@/features/auth/types';

const admin: AuthUser = {
  id: '1',
  email: 'admin@example.com',
  isEmailVerified: true,
  permissions: ['projects:read', 'settings:manage'],
};

describe('requirePermission', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('không throw khi user trong store có permission', () => {
    useAuthStore.getState().setAuthenticated(admin);

    expect(() => requirePermission('settings:manage')).not.toThrow();
  });

  it('throw ForbiddenError khi thiếu permission hoặc chưa đăng nhập', () => {
    expect(() => requirePermission('settings:manage')).toThrowError(
      ForbiddenError,
    );

    useAuthStore
      .getState()
      .setAuthenticated({ ...admin, permissions: ['projects:read'] });
    expect(() => requirePermission('settings:manage')).toThrowError(
      ForbiddenError,
    );
  });
});
