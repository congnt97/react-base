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

// Contract tường minh: đọc interface là biết feature nói chuyện với backend thế nào.
export interface AuthApi {
  login: (body: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  register: (body: RegisterRequest) => Promise<RegisterResponse>;
  me: () => Promise<AuthUser>;
}

export const authApi: AuthApi = {
  login: async (body) =>
    unwrapResponse(
      await http.post<ApiResponse<LoginResponse>, LoginRequest>(
        Endpoints.Auth.LOGIN,
        body,
      ),
    ),

  logout: async () => {
    await http.post<ApiResponse<void>>(Endpoints.Auth.LOGOUT);
  },

  register: async (body) =>
    unwrapResponse(
      await http.post<ApiResponse<RegisterResponse>, RegisterRequest>(
        Endpoints.Auth.REGISTER,
        body,
      ),
    ),

  me: async () =>
    unwrapResponse(await http.get<ApiResponse<AuthUser>>(Endpoints.Auth.ME)),
};
