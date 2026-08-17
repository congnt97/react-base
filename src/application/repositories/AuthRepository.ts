import type { ResponseCommon } from '@/application/dto/response/ResponseCommon';
import type {
  AuthMessageResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/domain/models/Auth';

export interface AuthRepository {
  login: (payload: LoginRequest) => Promise<ResponseCommon<LoginResponse>>;
  logout: () => Promise<ResponseCommon<void>>;
  register: (
    payload: RegisterRequest,
  ) => Promise<ResponseCommon<RegisterResponse>>;
  me: () => Promise<ResponseCommon<AuthUser>>;
  resendVerification: (
    email: string,
  ) => Promise<ResponseCommon<AuthMessageResponse>>;
}
