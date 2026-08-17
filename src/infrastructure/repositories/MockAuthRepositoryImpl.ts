import type { AuthRepository } from '@/application/repositories/AuthRepository';
import type {
  AuthMessageResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/domain/models/Auth';
import {
  mockAuthCredentials,
  mockAuthTokens,
  mockAuthUser,
  mockLoginResponse,
} from '@/mocks/auth.mock';
import { getStoredAccessToken } from '@/shared/auth-storage';

const delay = (ms = 250) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const MockAuthRepositoryImpl = (): AuthRepository => ({
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    await delay();

    if (
      payload.email !== mockAuthCredentials.email ||
      payload.password !== mockAuthCredentials.password
    ) {
      return Promise.reject({
        message: 'Email hoặc mật khẩu không đúng',
        statusCode: 401,
      });
    }

    return mockLoginResponse;
  },

  logout: async () => {
    await delay(100);
  },

  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    await delay();

    return {
      user: {
        ...mockAuthUser,
        id: 'mock-user',
        email: payload.email,
        name: payload.name,
      },
    };
  },

  me: async (): Promise<AuthUser> => {
    await delay(100);

    if (getStoredAccessToken() !== mockAuthTokens.accessToken) {
      return Promise.reject({
        message: 'Phiên đăng nhập không hợp lệ',
        statusCode: 401,
      });
    }

    return mockAuthUser;
  },

  resendVerification: async (): Promise<AuthMessageResponse> => {
    await delay();

    return {
      message: 'Đã gửi lại email xác thực',
    };
  },
});
