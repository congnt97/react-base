import { resolvePermissions } from '@/features/auth/permissions';
import type {
  AuthUser,
  AuthUserDto,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types';
import { unwrapResponse, type ApiResponse } from '@/lib/api-response';
import { Endpoints } from '@/lib/endpoints';
import { http } from '@/lib/http';

type LoginResponseDto = Omit<LoginResponse, 'user'> & { user: AuthUserDto };
type RegisterResponseDto = { user: AuthUserDto };

// API boundary: the backend's DTO becomes the app's AuthUser here, and only here.
// Listing each field as an object literal means adding a `role` by mistake is a TypeScript error.
const toAuthUser = (dto: AuthUserDto): AuthUser => ({
  id: dto.id,
  email: dto.email,
  name: dto.name,
  isEmailVerified: dto.isEmailVerified,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
  permissions: resolvePermissions(dto),
});

// Explicit contract: reading the interface tells you how the feature talks to the backend.
export interface AuthApi {
  login: (body: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  register: (body: RegisterRequest) => Promise<RegisterResponse>;
  me: () => Promise<AuthUser>;
}

export const authApi: AuthApi = {
  login: async (body) => {
    const response = unwrapResponse(
      await http.post<ApiResponse<LoginResponseDto>, LoginRequest>(
        Endpoints.Auth.LOGIN,
        body,
      ),
    );
    return { ...response, user: toAuthUser(response.user) };
  },

  logout: async () => {
    await http.post<ApiResponse<void>>(Endpoints.Auth.LOGOUT);
  },

  register: async (body) => {
    const response = unwrapResponse(
      await http.post<ApiResponse<RegisterResponseDto>, RegisterRequest>(
        Endpoints.Auth.REGISTER,
        body,
      ),
    );
    return { user: toAuthUser(response.user) };
  },

  me: async () =>
    toAuthUser(
      unwrapResponse(
        await http.get<ApiResponse<AuthUserDto>>(Endpoints.Auth.ME),
      ),
    ),
};
