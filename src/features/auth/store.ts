import { create } from 'zustand';

import type { AuthUser } from '@/features/auth/types';
import {
  clearAuthStorage,
  hasStoredAccessToken,
  persistAuthTokens,
  type AuthTokens,
} from '@/lib/auth-storage';

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuthenticated: (user?: AuthUser | null, tokens?: AuthTokens) => void;
  clearAuth: () => void;
};

// Token là source of truth ở auth-storage; store chỉ giữ UI state.
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
