import { delay, http } from 'msw';

import { ROLE_PERMISSIONS } from '@/features/auth/permissions';
import {
  Role,
  type AuthUserDto,
  type LoginRequest,
} from '@/features/auth/types';
import { Endpoints } from '@/lib/endpoints';
import { apiUrl, fail, ok } from '@/mocks/utils';

type MockAccount = {
  user: AuthUserDto;
  password: string;
  accessToken: string;
  refreshToken: string;
};

// Two accounts to show the permission difference: admin has everything, user can't
// delete projects and can't access Settings.
//
// The backend isn't finalized, so the two accounts return two different shapes so both
// branches of resolvePermissions run for real in dev and E2E: admin returns `permissions`
// (backend decides permissions), user only returns `role` (frontend looks it up in
// ROLE_PERMISSIONS). Once the real backend is known, change both to the same shape.
const mockAccounts: MockAccount[] = [
  {
    user: {
      id: 'mock-admin',
      email: 'admin@example.com',
      name: 'Admin',
      role: Role.ADMIN,
      permissions: [...ROLE_PERMISSIONS[Role.ADMIN]],
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
