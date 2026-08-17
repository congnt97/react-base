import type { LoginResponse, RefreshTokenResponse } from '@/domain/models/Auth';
import { Constants } from '@/shared/constants';

export type AuthTokenPayload = Pick<
  LoginResponse | RefreshTokenResponse,
  'accessToken' | 'refreshToken'
>;

const getStorageItem = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const persistAuthTokens = (payload: AuthTokenPayload) => {
  setStorageItem(Constants.API_TOKEN_STORAGE, payload.accessToken);
  setStorageItem(Constants.API_REFRESH_TOKEN_STORAGE, payload.refreshToken);
};

export const clearAuthStorage = () => {
  localStorage.removeItem(Constants.API_TOKEN_STORAGE);
  localStorage.removeItem(Constants.API_REFRESH_TOKEN_STORAGE);
};

export const getStoredAccessToken = () =>
  getStorageItem<string>(Constants.API_TOKEN_STORAGE);

export const getStoredRefreshToken = () =>
  getStorageItem<string>(Constants.API_REFRESH_TOKEN_STORAGE);

export const hasStoredAccessToken = () => Boolean(getStoredAccessToken());

const sessionExpiredListeners = new Set<() => void>();

export const subscribeSessionExpired = (listener: () => void) => {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
};

export const notifySessionExpired = () => {
  sessionExpiredListeners.forEach((listener) => listener());
};
