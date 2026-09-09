import { describe, expect, it } from 'vitest';

import { can } from '@/features/auth/permissions';
import { Role } from '@/features/auth/types';

const admin = { role: Role.ADMIN };
const user = { role: Role.USER };

describe('can', () => {
  it('admin có mọi permission', () => {
    expect(can(admin, 'projects:delete')).toBe(true);
    expect(can(admin, 'settings:manage')).toBe(true);
  });

  it('user chỉ có permission được cấp', () => {
    expect(can(user, 'projects:read')).toBe(true);
    expect(can(user, 'projects:update')).toBe(true);
    expect(can(user, 'projects:delete')).toBe(false);
    expect(can(user, 'settings:manage')).toBe(false);
  });

  it('yêu cầu nhiều permission thì phải có đủ tất cả', () => {
    expect(can(user, 'projects:read', 'projects:create')).toBe(true);
    expect(can(user, 'projects:read', 'projects:delete')).toBe(false);
  });

  it('sai khi không có user hoặc không truyền permission', () => {
    expect(can(null, 'projects:read')).toBe(false);
    expect(can(undefined, 'projects:read')).toBe(false);
    expect(can(admin)).toBe(false);
  });
});
