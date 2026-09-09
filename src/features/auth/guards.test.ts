import { beforeEach, describe, expect, it } from 'vitest';

import { ForbiddenError, hasRole, requireRole } from '@/features/auth/guards';
import { useAuthStore } from '@/features/auth/store';
import { Role, type AuthUser } from '@/features/auth/types';

const admin: AuthUser = {
  id: '1',
  email: 'admin@example.com',
  role: Role.ADMIN,
  isEmailVerified: true,
};

describe('hasRole', () => {
  it('đúng khi user có một trong các role yêu cầu', () => {
    expect(hasRole(admin, Role.ADMIN)).toBe(true);
    expect(hasRole(admin, Role.USER, Role.ADMIN)).toBe(true);
  });

  it('sai khi user không có role yêu cầu', () => {
    expect(hasRole(admin, Role.USER)).toBe(false);
  });

  it('sai khi không có user hoặc không truyền role nào', () => {
    expect(hasRole(null, Role.ADMIN)).toBe(false);
    expect(hasRole(undefined, Role.ADMIN)).toBe(false);
    expect(hasRole(admin)).toBe(false);
  });
});

describe('requireRole', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('không throw khi user trong store có role', () => {
    useAuthStore.getState().setAuthenticated(admin);

    expect(() => requireRole(Role.ADMIN)).not.toThrow();
  });

  it('throw ForbiddenError khi user thiếu role hoặc chưa đăng nhập', () => {
    expect(() => requireRole(Role.ADMIN)).toThrowError(ForbiddenError);

    useAuthStore.getState().setAuthenticated({ ...admin, role: Role.USER });
    expect(() => requireRole(Role.ADMIN)).toThrowError(ForbiddenError);
  });
});
