import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearAuthStorage,
  getStoredAccessToken,
  getStoredRefreshToken,
  hasStoredAccessToken,
  notifySessionExpired,
  persistAuthTokens,
  subscribeSessionExpired,
} from '@/shared/auth-storage';

describe('auth-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lưu và đọc lại token', () => {
    persistAuthTokens({ accessToken: 'access', refreshToken: 'refresh' });

    expect(getStoredAccessToken()).toBe('access');
    expect(getStoredRefreshToken()).toBe('refresh');
    expect(hasStoredAccessToken()).toBe(true);
  });

  it('clear xoá toàn bộ token', () => {
    persistAuthTokens({ accessToken: 'access', refreshToken: 'refresh' });

    clearAuthStorage();

    expect(getStoredAccessToken()).toBeNull();
    expect(getStoredRefreshToken()).toBeNull();
    expect(hasStoredAccessToken()).toBe(false);
  });

  it('trả về null khi storage chứa giá trị không parse được', () => {
    localStorage.setItem('react_base_access_token', 'not-json{');

    expect(getStoredAccessToken()).toBeNull();
  });

  it('thông báo session hết hạn tới listener đã đăng ký', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeSessionExpired(listener);

    notifySessionExpired();
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    notifySessionExpired();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
