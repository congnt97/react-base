import {
  unwrapResponse,
  type ResponseCommon,
} from '@/application/dto/response/ResponseCommon';
import type { AuthRepository } from '@/application/repositories/AuthRepository';
import type {
  AuthMessageResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/domain/models/Auth';
import { httpClient } from '@/infrastructure/http/HttpClient';
import { Endpoints } from '@/shared/endpoints';

export const AuthRepositoryImpl = (): AuthRepository => ({
  login: async (payload) =>
    unwrapResponse(
      await httpClient.post<ResponseCommon<LoginResponse>, LoginRequest>(
        Endpoints.Auth.LOGIN,
        payload,
      ),
    ),

  logout: async () => {
    await httpClient.post<ResponseCommon<void>>(Endpoints.Auth.LOGOUT);
  },

  register: async (payload) =>
    unwrapResponse(
      await httpClient.post<ResponseCommon<RegisterResponse>, RegisterRequest>(
        Endpoints.Auth.REGISTER,
        payload,
      ),
    ),

  me: async () =>
    unwrapResponse(
      await httpClient.get<ResponseCommon<AuthUser>>(Endpoints.Auth.ME),
    ),

  resendVerification: async (email) =>
    unwrapResponse(
      await httpClient.post<
        ResponseCommon<AuthMessageResponse>,
        { email: string }
      >(Endpoints.Auth.RESEND_VERIFICATION, { email }),
    ),
});
