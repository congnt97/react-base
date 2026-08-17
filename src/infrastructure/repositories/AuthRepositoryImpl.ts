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
import { httpClient } from '@/infrastructure/http/HttpClient';
import { Endpoints } from '@/shared/endpoints';

export const AuthRepositoryImpl = (): AuthRepository => ({
  login: (payload) =>
    httpClient.post<ResponseCommon<LoginResponse>, LoginRequest>(
      Endpoints.Auth.LOGIN,
      payload,
    ),

  logout: () => httpClient.post<ResponseCommon<void>>(Endpoints.Auth.LOGOUT),

  register: (payload) =>
    httpClient.post<ResponseCommon<RegisterResponse>, RegisterRequest>(
      Endpoints.Auth.REGISTER,
      payload,
    ),

  me: () => httpClient.get<ResponseCommon<AuthUser>>(Endpoints.Auth.ME),

  resendVerification: (email) =>
    httpClient.post<ResponseCommon<AuthMessageResponse>, { email: string }>(
      Endpoints.Auth.RESEND_VERIFICATION,
      { email },
    ),
});
