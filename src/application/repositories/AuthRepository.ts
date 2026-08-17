import type {
  AuthMessageResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/domain/models/Auth';

export interface AuthRepository {
  login: (payload: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  register: (payload: RegisterRequest) => Promise<RegisterResponse>;
  me: () => Promise<AuthUser>;
  resendVerification: (email: string) => Promise<AuthMessageResponse>;
}
