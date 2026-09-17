import { Role, type AuthUser, type AuthUserDto } from '@/features/auth/types';
import { monitoring } from '@/lib/monitoring';

// Permission by action on a resource: `<resource>:<action>`. This is the list of
// permissions the frontend knows and has UI for; the backend may have more.
export enum Permission {
  PROJECTS_READ = 'projects:read',
  PROJECTS_CREATE = 'projects:create',
  PROJECTS_UPDATE = 'projects:update',
  PROJECTS_DELETE = 'projects:delete',
  MEMBERS_READ = 'members:read',
  MEMBERS_CREATE = 'members:create',
  MEMBERS_UPDATE = 'members:update',
  MEMBERS_DELETE = 'members:delete',
  SETTINGS_MANAGE = 'settings:manage',
}

const PERMISSION_VALUES: readonly string[] = Object.values(Permission);

/**
 * Permissions by role. Only read when the backend returns `role` without `permissions`,
 * and used by the mock to simulate the backend. Ignored when the backend returns `permissions`.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.USER]: [
    Permission.PROJECTS_READ,
    Permission.PROJECTS_CREATE,
    Permission.PROJECTS_UPDATE,
    Permission.MEMBERS_READ,
  ],
};

const isPermission = (value: string): value is Permission =>
  PERMISSION_VALUES.includes(value);

const isRole = (value: string): value is Role =>
  (Object.values(Role) as string[]).includes(value);

// Each unknown value is reported only once per session: enough to see a naming
// mismatch between backend and frontend in monitoring, without spamming on every /auth/me call.
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
 * Normalizes permissions from the backend into the list the frontend knows, in order:
 * 1. If `permissions` is present (even an empty array), use it and ignore `role`. Unknown
 *    strings are dropped and reported to monitoring once.
 * 2. No `permissions` but a valid `role`: look it up in `ROLE_PERMISSIONS`.
 * 3. Otherwise, no permissions at all: deny by default is the safe fallback.
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

/** The single place that decides permission. Frontend only hides/shows and guards routes; the backend must still enforce it. */
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
