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
  setAuthenticated: (user?: AuthUser | null, tokens?: AuthTokenPayload) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: hasStoredAccessToken(),
  setAuthenticated: (user = null, tokens) => {
    if (tokens) {
      persistAuthTokens(tokens);
    }
    set((state) =>
      state.user === user && state.isAuthenticated
        ? state
        : { user, isAuthenticated: true },
    );
  },
  clearAuth: () => {
    clearAuthStorage();
    set((state) =>
      !state.user && !state.isAuthenticated
        ? state
        : { user: null, isAuthenticated: false },
    );
  },
}));
