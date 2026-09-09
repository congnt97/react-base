import { delay, http } from 'msw';

import { Role, type AuthUser, type LoginRequest } from '@/features/auth/types';
import { Endpoints } from '@/lib/endpoints';
import { apiUrl, fail, ok } from '@/mocks/utils';

type MockAccount = {
  user: AuthUser;
  password: string;
  accessToken: string;
  refreshToken: string;
};

// Hai tài khoản để thấy khác biệt permission: admin có tất cả, user không xoá
// dự án và không vào Cài đặt.
const mockAccounts: MockAccount[] = [
  {
    user: {
      id: 'mock-admin',
      email: 'admin@example.com',
      name: 'Admin',
      role: Role.ADMIN,
      isEmailVerified: true,
    },
    password: '123456',
    accessToken: 'mock-access-admin',
    refreshToken: 'mock-refresh-admin',
  },
  {
    user: {
      id: 'mock-user',
      email: 'user@example.com',
      name: 'Người dùng',
      role: Role.USER,
      isEmailVerified: true,
    },
    password: '123456',
    accessToken: 'mock-access-user',
    refreshToken: 'mock-refresh-user',
  },
];

const findByRequest = (request: Request) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  return mockAccounts.find((account) => account.accessToken === token);
};

export const authHandlers = [
  http.post(apiUrl(Endpoints.Auth.LOGIN), async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as LoginRequest;
    const account = mockAccounts.find(
      ({ user, password }) =>
        user.email === body.email && password === body.password,
    );

    if (!account) {
      return fail(401, 'Email hoặc mật khẩu không đúng');
    }

    const { user, accessToken, refreshToken } = account;
    return ok({ user, accessToken, refreshToken });
  }),

  http.get(apiUrl(Endpoints.Auth.ME), async ({ request }) => {
    await delay(200);
    const account = findByRequest(request);
    return account
      ? ok(account.user)
      : fail(401, 'Phiên đăng nhập không hợp lệ');
  }),

  http.post(apiUrl(Endpoints.Auth.REFRESH_TOKEN), async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as { refreshToken?: string };
    const account = mockAccounts.find(
      ({ refreshToken }) => refreshToken === body.refreshToken,
    );
    return account
      ? ok({
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
        })
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
      user: {
        id: `mock-${Date.now()}`,
        role: Role.USER,
        isEmailVerified: false,
        ...body,
      },
    });
  }),
];
