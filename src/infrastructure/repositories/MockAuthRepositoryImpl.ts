import type { ResponseCommon } from '@/application/dto/response/ResponseCommon';
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
  login: async (
    payload: LoginRequest,
  ): Promise<ResponseCommon<LoginResponse>> => {
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

    return {
      success: true,
      data: mockLoginResponse,
    };
  },

  logout: async () => {
    await delay(100);
    return { success: true };
  },

  register: async (
    payload: RegisterRequest,
  ): Promise<ResponseCommon<RegisterResponse>> => {
    await delay();

    return {
      success: true,
      data: {
        user: {
          ...mockAuthUser,
          id: 'mock-user',
          email: payload.email,
          name: payload.name,
        },
      },
    };
  },

  me: async (): Promise<ResponseCommon<AuthUser>> => {
    await delay(100);

    if (getStoredAccessToken() !== mockAuthTokens.accessToken) {
      return Promise.reject({
        message: 'Phiên đăng nhập không hợp lệ',
        statusCode: 401,
      });
    }

    return {
      success: true,
      data: mockAuthUser,
    };
  },

  resendVerification: async (): Promise<ResponseCommon<AuthMessageResponse>> => {
    await delay();

    return {
      success: true,
      data: {
        message: 'Đã gửi lại email xác thực',
      },
    };
  },
});
