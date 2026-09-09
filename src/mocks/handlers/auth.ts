import { delay, http } from 'msw';

import { Role, type AuthUser, type LoginRequest } from '@/features/auth/types';
import { Endpoints } from '@/lib/endpoints';
import { apiUrl, fail, ok } from '@/mocks/utils';

export const mockUser: AuthUser = {
  id: 'mock-admin',
  email: 'admin@example.com',
  name: 'Admin',
  role: Role.ADMIN,
  isEmailVerified: true,
};

export const mockCredentials = {
  email: 'admin@example.com',
  password: '123456',
};

export const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

const isAuthorized = (request: Request) =>
  request.headers.get('Authorization') === `Bearer ${mockTokens.accessToken}`;

export const authHandlers = [
  http.post(apiUrl(Endpoints.Auth.LOGIN), async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as LoginRequest;

    if (
      body.email !== mockCredentials.email ||
      body.password !== mockCredentials.password
    ) {
      return fail(401, 'Email hoặc mật khẩu không đúng');
    }

    return ok({ user: mockUser, ...mockTokens });
  }),

  http.get(apiUrl(Endpoints.Auth.ME), async ({ request }) => {
    await delay(200);
    return isAuthorized(request)
      ? ok(mockUser)
      : fail(401, 'Phiên đăng nhập không hợp lệ');
  }),

  http.post(apiUrl(Endpoints.Auth.REFRESH_TOKEN), async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as { refreshToken?: string };
    return body.refreshToken === mockTokens.refreshToken
      ? ok(mockTokens)
      : fail(401, 'Refresh token không hợp lệ');
  }),

  http.post(apiUrl(Endpoints.Auth.LOGOUT), async () => {
    await delay(100);
    return ok(null);
  }),

  http.post(apiUrl(Endpoints.Auth.REGISTER), async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { name: string; email: string };
    return ok({
      user: { ...mockUser, id: 'mock-user', role: Role.USER, ...body },
    });
  }),
];
