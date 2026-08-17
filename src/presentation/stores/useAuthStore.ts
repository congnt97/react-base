import { create } from 'zustand';

import type { AuthUser } from '@/domain/models/Auth';
import {
  clearAuthStorage,
  hasStoredAccessToken,
  persistAuthTokens,
  type AuthTokenPayload,
} from '@/shared/auth-storage';

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthenticated: (user?: AuthUser | null, tokens?: AuthTokenPayload) => void;
  clearAuth: () => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: hasStoredAccessToken(),
  isLoading: hasStoredAccessToken(),
  setAuthenticated: (user = null, tokens) => {
    if (tokens) {
      persistAuthTokens(tokens);
    }
    set({ user, isAuthenticated: true, isLoading: false });
  },
  clearAuth: () => {
    clearAuthStorage();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  setIsLoading: (isLoading) => set({ isLoading }),
}));
