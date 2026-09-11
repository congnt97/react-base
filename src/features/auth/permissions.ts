import { Role, type AuthUser, type AuthUserDto } from '@/features/auth/types';
import { monitoring } from '@/lib/monitoring';

// Permission theo hành động trên resource: `<resource>:<action>`. Đây là danh sách
// quyền frontend biết và có UI tương ứng; backend có thể có nhiều hơn.
const PERMISSIONS = [
  'projects:read',
  'projects:create',
  'projects:update',
  'projects:delete',
  'members:read',
  'members:create',
  'members:update',
  'members:delete',
  'settings:manage',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Quyền theo role. Chỉ được đọc khi backend trả `role` mà không trả `permissions`,
 * và để mock mô phỏng backend. Backend trả `permissions` thì bảng này bị bỏ qua.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.ADMIN]: PERMISSIONS,
  [Role.USER]: [
    'projects:read',
    'projects:create',
    'projects:update',
    'members:read',
  ],
};

const isPermission = (value: string): value is Permission =>
  (PERMISSIONS as readonly string[]).includes(value);

const isRole = (value: string): value is Role =>
  (Object.values(Role) as string[]).includes(value);

// Mỗi giá trị lạ chỉ báo một lần mỗi phiên: đủ để thấy lệch tên giữa backend và
// frontend trên monitoring, không spam mỗi lần gọi /auth/me.
const reported = new Set<string>();

const reportUnknown = (kind: 'permission' | 'role', value: string) => {
  const key = `${kind}:${value}`;
  if (reported.has(key)) {
    return;
  }
  reported.add(key);
  monitoring.captureException(
    new Error(`Backend trả ${kind} frontend không biết: ${value}`),
    { source: 'permissions', kind, value },
  );
};

/**
 * Chuẩn hoá quyền từ backend về danh sách frontend biết, theo thứ tự:
 * 1. Có `permissions` (kể cả mảng rỗng) thì dùng nó, không nhìn `role`. Chuỗi lạ
 *    bị bỏ và báo monitoring một lần.
 * 2. Không có `permissions` mà có `role` hợp lệ thì tra `ROLE_PERMISSIONS`.
 * 3. Còn lại không có quyền nào: từ chối là mặc định an toàn.
 */
export const resolvePermissions = (
  dto: Pick<AuthUserDto, 'role' | 'permissions'>,
): Permission[] => {
  if (dto.permissions) {
    for (const value of dto.permissions) {
      if (!isPermission(value)) {
        reportUnknown('permission', value);
      }
    }
    return [...new Set(dto.permissions.filter(isPermission))];
  }

  if (dto.role === undefined) {
    return [];
  }
  if (!isRole(dto.role)) {
    reportUnknown('role', dto.role);
    return [];
  }
  return [...ROLE_PERMISSIONS[dto.role]];
};

/** Nơi duy nhất quyết định quyền. Frontend chỉ ẩn/hiện và chặn route; backend vẫn phải enforce. */
export const can = (
  user: Pick<AuthUser, 'permissions'> | null | undefined,
  ...permissions: Permission[]
) => {
  if (!user || permissions.length === 0) {
    return false;
  }

  return permissions.every((permission) =>
    user.permissions.includes(permission),
  );
};
