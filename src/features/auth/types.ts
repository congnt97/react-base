import type { Permission } from '@/features/auth/permissions';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * User đúng như backend trả về. Backend chưa chốt nên nhận cả hai kiểu phổ biến:
 * có `permissions` (backend quyết định quyền) hoặc chỉ có `role` (frontend tra
 * `ROLE_PERMISSIONS`). Chỉ `features/auth/api.ts` và mock dùng type này.
 */
export type AuthUserDto = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  permissions?: string[];
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * User bên trong app, đã chuẩn hoá ở `api.ts`. Cố ý không có `role`: mọi quyết
 * định quyền đi qua `can()` với `permissions`, nên đổi kiểu backend không phải
 * sửa feature nào. Cần hiển thị vai trò thì thêm field nhãn (vd `roleLabel`) ở
 * biên API, không đưa `role` vào lại.
 */
export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  permissions: readonly Permission[];
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  user: AuthUser;
};
