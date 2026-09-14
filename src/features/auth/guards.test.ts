import { beforeEach, describe, expect, it } from 'vitest';

import { ForbiddenError, requirePermission } from '@/features/auth/guards';
import { useAuthStore } from '@/features/auth/store';
import type { AuthUser } from '@/features/auth/types';
import { Permission } from '@/features/auth/permissions';

const admin: AuthUser = {
  id: '1',
  email: 'admin@example.com',
  isEmailVerified: true,
  permissions: [Permission.PROJECTS_READ, Permission.SETTINGS_MANAGE],
};

describe('requirePermission', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('không throw khi user trong store có permission', () => {
    useAuthStore.getState().setAuthenticated(admin);

    expect(() => requirePermission(Permission.SETTINGS_MANAGE)).not.toThrow();
  });

  it('throw ForbiddenError khi thiếu permission hoặc chưa đăng nhập', () => {
    expect(() => requirePermission(Permission.SETTINGS_MANAGE)).toThrowError(
      ForbiddenError,
    );

    useAuthStore
      .getState()
      .setAuthenticated({ ...admin, permissions: [Permission.PROJECTS_READ] });
    expect(() => requirePermission(Permission.SETTINGS_MANAGE)).toThrowError(
      ForbiddenError,
    );
  });
});
