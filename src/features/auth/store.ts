import { create } from 'zustand';

import type { AuthUser } from '@/features/auth/types';
import {
  clearAuthStorage,
  hasStoredAccessToken,
  persistAuthTokens,
  type AuthTokens,
} from '@/lib/auth-storage';
import { monitoring } from '@/lib/monitoring';

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuthenticated: (user?: AuthUser | null, tokens?: AuthTokens) => void;
  clearAuth: () => void;
};

// The token's source of truth is auth-storage; the store only holds UI state.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: hasStoredAccessToken(),
  setAuthenticated: (user = null, tokens) => {
    if (tokens) {
      persistAuthTokens(tokens);
    }
    if (user) {
      monitoring.setUser({ id: user.id, email: user.email });
    }
    set((state) =>
      state.user === user && state.isAuthenticated
        ? state
        : { user, isAuthenticated: true },
    );
  },
  clearAuth: () => {
    clearAuthStorage();
    monitoring.setUser(null);
    set((state) =>
      !state.user && !state.isAuthenticated
        ? state
        : { user: null, isAuthenticated: false },
    );
  },
}));
