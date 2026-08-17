import type { AuthUser } from '@/domain/models/Auth';
import type { Role } from '@/shared/enums/Roles';

export const hasRole = (
  user: AuthUser | null | undefined,
  ...roles: Role[]
) => Boolean(user && roles.includes(user.role));
