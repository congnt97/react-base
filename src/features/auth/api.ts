import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types';
import { unwrapResponse, type ApiResponse } from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http } from '@/lib/http';

export const authApi = {
  login: async (body: LoginRequest) =>
    unwrapResponse(
      await http.post<ApiResponse<LoginResponse>, LoginRequest>(
        Endpoints.Auth.LOGIN,
        body,
      ),
    ),

  logout: async () => {
    await http.post<ApiResponse<void>>(Endpoints.Auth.LOGOUT);
  },

  register: async (body: RegisterRequest) =>
    unwrapResponse(
      await http.post<ApiResponse<RegisterResponse>, RegisterRequest>(
        Endpoints.Auth.REGISTER,
        body,
      ),
    ),

  me: async () =>
    unwrapResponse(await http.get<ApiResponse<AuthUser>>(Endpoints.Auth.ME)),
};
