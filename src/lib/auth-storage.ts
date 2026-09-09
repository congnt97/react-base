const ACCESS_TOKEN_KEY = 'react_base_access_token';
const REFRESH_TOKEN_KEY = 'react_base_refresh_token';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

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

export const persistAuthTokens = (tokens: AuthTokens) => {
  setStorageItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  setStorageItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getStoredAccessToken = () =>
  getStorageItem<string>(ACCESS_TOKEN_KEY);

export const getStoredRefreshToken = () =>
  getStorageItem<string>(REFRESH_TOKEN_KEY);

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
