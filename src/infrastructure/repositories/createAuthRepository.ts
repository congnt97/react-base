import type { AuthRepository } from '@/application/repositories/AuthRepository';
import { env } from '@/env';
import { AuthRepositoryImpl } from '@/infrastructure/repositories/AuthRepositoryImpl';
import { MockAuthRepositoryImpl } from '@/infrastructure/repositories/MockAuthRepositoryImpl';

export const createAuthRepository = (): AuthRepository =>
  import.meta.env.DEV && env.VITE_ENABLE_MOCK_AUTH
    ? MockAuthRepositoryImpl()
    : AuthRepositoryImpl();
