import type { Role } from '@/shared/enums/Roles';

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export type RefreshTokenResponse = LoginResponse;

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: AuthUser;
};

export type AuthMessageResponse = {
  message?: string;
};
