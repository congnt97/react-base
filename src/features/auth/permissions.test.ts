import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  can,
  resolvePermissions,
  ROLE_PERMISSIONS,
} from '@/features/auth/permissions';
import { Role } from '@/features/auth/types';
import { monitoring } from '@/lib/monitoring';

const captureException = vi.fn();

beforeEach(() => {
  captureException.mockClear();
  monitoring.use({ captureException, setUser: () => undefined });
});

afterEach(() => {
  monitoring.reset();
});

describe('can', () => {
  const editor = { permissions: ['projects:read', 'projects:update'] as const };

  it('có permission được cấp thì true, không có thì false', () => {
    expect(can(editor, 'projects:read')).toBe(true);
    expect(can(editor, 'projects:delete')).toBe(false);
  });

  it('yêu cầu nhiều permission thì phải có đủ tất cả', () => {
    expect(can(editor, 'projects:read', 'projects:update')).toBe(true);
    expect(can(editor, 'projects:read', 'projects:delete')).toBe(false);
  });

  it('sai khi không có user hoặc không truyền permission', () => {
    expect(can(null, 'projects:read')).toBe(false);
    expect(can(undefined, 'projects:read')).toBe(false);
    expect(can(editor)).toBe(false);
  });
});

describe('resolvePermissions', () => {
  it('backend trả permissions thì dùng đúng danh sách đó, không nhìn role', () => {
    expect(
      resolvePermissions({ role: Role.ADMIN, permissions: ['projects:read'] }),
    ).toEqual(['projects:read']);
  });

  it('permissions rỗng nghĩa là không có quyền, không rơi về bảng role', () => {
    expect(resolvePermissions({ role: Role.ADMIN, permissions: [] })).toEqual(
      [],
    );
  });

  it('bỏ permission lạ, báo monitoring đúng một lần cho mỗi giá trị', () => {
    const dto = { permissions: ['projects:read', 'project:delete'] };

    expect(resolvePermissions(dto)).toEqual(['projects:read']);
    resolvePermissions(dto);

    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledWith(expect.any(Error), {
      source: 'permissions',
      kind: 'permission',
      value: 'project:delete',
    });
  });

  it('bỏ permission trùng lặp', () => {
    expect(
      resolvePermissions({ permissions: ['members:read', 'members:read'] }),
    ).toEqual(['members:read']);
  });

  it('backend chỉ trả role thì tra ROLE_PERMISSIONS', () => {
    expect(resolvePermissions({ role: Role.USER })).toEqual([
      ...ROLE_PERMISSIONS[Role.USER],
    ]);
    expect(resolvePermissions({ role: Role.ADMIN })).toContain(
      'settings:manage',
    );
  });

  it('role lạ thì không có quyền nào và báo monitoring', () => {
    expect(resolvePermissions({ role: 'superman' })).toEqual([]);
    expect(captureException).toHaveBeenCalledWith(expect.any(Error), {
      source: 'permissions',
      kind: 'role',
      value: 'superman',
    });
  });

  it('không có cả role lẫn permissions thì không có quyền nào', () => {
    expect(resolvePermissions({})).toEqual([]);
    expect(captureException).not.toHaveBeenCalled();
  });

  it('kết quả là bản sao, sửa không làm hỏng bảng role', () => {
    const granted = resolvePermissions({ role: Role.USER });
    granted.push('settings:manage');

    expect(ROLE_PERMISSIONS[Role.USER]).not.toContain('settings:manage');
  });
});
