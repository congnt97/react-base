import { describe, expect, it } from 'vitest';

import type { AuthUser } from '@/domain/models/Auth';
import { Role } from '@/shared/enums/Roles';
import { hasRole } from '@/shared/route-guards';

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
