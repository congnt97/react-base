import type { Permission } from '@/features/auth/permissions';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * User exactly as the backend returns it. The backend isn't finalized yet, so this
 * accepts both common shapes: with `permissions` (backend decides permissions) or with
 * only `role` (frontend looks it up in `ROLE_PERMISSIONS`). Only `features/auth/api.ts`
 * and the mock use this type.
 */
export type AuthUserDto = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  permissions?: string[];
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * User inside the app, already normalized in `api.ts`. Deliberately has no `role`: every
 * permission decision goes through `can()` with `permissions`, so a backend shape change
 * never requires touching any feature. If a role needs to be displayed, add a label field
 * (e.g. `roleLabel`) at the API boundary — don't bring `role` back.
 */
export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  permissions: readonly Permission[];
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: AuthUser;
};
