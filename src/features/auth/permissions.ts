import { Role, type AuthUser } from '@/features/auth/types';

// Permission theo hành động trên resource: `<resource>:<action>`.
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

// Frontend chỉ dùng để ẩn/hiện UI và guard route; backend vẫn phải enforce.
const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.ADMIN]: PERMISSIONS,
  [Role.USER]: [
    'projects:read',
    'projects:create',
    'projects:update',
    'members:read',
  ],
};

export const can = (
  user: Pick<AuthUser, 'role'> | null | undefined,
  ...permissions: Permission[]
) => {
  if (!user || permissions.length === 0) {
    return false;
  }

  const granted = ROLE_PERMISSIONS[user.role];
  return permissions.every((permission) => granted.includes(permission));
};
