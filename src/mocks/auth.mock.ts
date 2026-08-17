import type { AuthUser, LoginResponse } from '@/domain/models/Auth';
import { Role } from '@/shared/enums/Roles';

export const mockAuthUser: AuthUser = {
  id: 'mock-admin',
  email: 'admin@example.com',
  name: 'Admin',
  role: Role.ADMIN,
  isEmailVerified: true,
};

export const mockAuthCredentials = {
  email: 'admin@example.com',
  password: '123456',
} as const;

export const mockAuthTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
} as const;

export const mockLoginResponse: LoginResponse = {
  user: mockAuthUser,
  ...mockAuthTokens,
};
